"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getSocket, initSocket } from "../SocketClient";

const CallComponent = ({ userId }) => {
  const [inCall, setInCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callOffer, setCallOffer] = useState(null);
  const [callAnswer, setCallAnswer] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  // Initialize socket only once
  useEffect(() => {
    initSocket(userId);

    const socket = getSocket();

    // Handle incoming offers
    socket.on("offer", handleIncomingOffer);

    // Handle incoming answers
    socket.on("answer", handleIncomingAnswer);

    // Handle ICE candidates
    socket.on("candidate", handleNewICECandidate);

    return () => {
      // Clean up the socket and peer connection when the component unmounts
      socket.off("offer", handleIncomingOffer);
      socket.off("answer", handleIncomingAnswer);
      socket.off("candidate", handleNewICECandidate);

      if (peerConnection) {
        peerConnection.close();
      }

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop()); // Stop the local stream
      }
    };
  }, [userId, peerConnection, localStream]);

  // Create a peer connection and add local media
  const createPeerConnection = useCallback(async () => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    // Get user media (audio)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setLocalStream(stream);

    // Add the stream to the peer connection
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    return pc;
  }, []);

  // Start the call
  const startCall = async (targetUserId) => {
    const socket = getSocket();

    try {
      const pc = await createPeerConnection();

      // Create an offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send the offer to the target user
      socket.emit("offer", { userId: targetUserId, offer });

      // Set up the remote stream once it's received
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      // Handle ICE candidates
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socket.emit("candidate", { userId: targetUserId, candidate });
        }
      };

      setInCall(true);
    } catch (err) {
      console.error("Error starting call:", err);
    }
  };

  // Handle incoming offer
  const handleIncomingOffer = async (offer) => {
    const socket = getSocket();
    try {
      const pc = await createPeerConnection();

      // Set the remote description to the offer received
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      // Create an answer and send it back to the caller
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { userId: offer.userId, answer });

      // Set up the remote stream once it's received
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      // Handle ICE candidates
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socket.emit("candidate", { userId: offer.userId, candidate });
        }
      };

      setInCall(true);
      setCallAccepted(true);
      setCallOffer(offer);
    } catch (err) {
      console.error("Error handling offer:", err);
    }
  };

  // Handle incoming answer
  const handleIncomingAnswer = (answer) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    setCallAccepted(true);
  };

  // Handle ICE candidates
  const handleNewICECandidate = (candidate) => {
    if (peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  // Answer the call
  const answerCall = async () => {
    const socket = getSocket();

    try {
      const pc = await createPeerConnection();

      // Set remote description from the offer
      await pc.setRemoteDescription(new RTCSessionDescription(callOffer));

      // Create an answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { userId: callOffer.userId, answer });

      // Set up the remote stream
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      // Handle ICE candidates
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socket.emit("candidate", { userId: callOffer.userId, candidate });
        }
      };

      setCallAccepted(true);
      setInCall(true);
    } catch (err) {
      console.error("Error answering the call:", err);
    }
  };

  // Hang up the call
  const hangUp = () => {
    if (peerConnection) peerConnection.close();
    setInCall(false);
    setCallAccepted(false);
    setLocalStream(null);
    setRemoteStream(null);
  };

  return (
    <div>
      <h2>Phone Call</h2>

      {/* Call Controls */}
      {!inCall ? (
        <button onClick={() => startCall("receiverUserId")}>Start Call</button>
      ) : (
        <>
          {!callAccepted ? (
            <button onClick={answerCall}>Answer Call</button>
          ) : (
            <button onClick={hangUp}>Hang Up</button>
          )}
        </>
      )}

      {/* Display audio streams */}
      {remoteStream && (
        <audio controls autoPlay>
          <source src={URL.createObjectURL(remoteStream)} />
        </audio>
      )}
    </div>
  );
};

export default CallComponent;

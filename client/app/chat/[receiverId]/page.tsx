"use client";
import { useAppSelector } from "@/app/libs/hooks";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import {
  useCreateConversationMutation,
  useGetConversationsQuery,
} from "@/app/libs/features/apis/ConversationApi";

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || user?._id;
  console.log("user: ", user);
  const { receiverId } = useParams();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  console.log("conversationId: ", conversationId);
  const { register, handleSubmit, reset } = useForm();

  const [createConversation] = useCreateConversationMutation();
  const { data: conversations } = useGetConversationsQuery({}, { skip: !user });

  const [messages, setMessages] = useState<any>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  console.log("activeConversation: ", activeConversation);

  // Find the active conversation based on the conversationId
  useEffect(() => {
    if (conversationId) {
      const foundConversation = conversations?.find(
        (conversation) => conversation._id === conversationId
      );
      setActiveConversation(foundConversation);
    } else {
      // If no conversationId, try finding the conversation based on receiverId
      const foundConversation = conversations?.find(
        (conversation) =>
          conversation.participants.some(
            (participant) => participant._id === receiverId
          ) &&
          conversation.participants.some(
            (participant) => participant._id === userId
          )
      );
      setActiveConversation(foundConversation);
    }
  }, [conversations, conversationId, receiverId, userId]);

  // Load messages from active conversation
  useEffect(() => {
    if (activeConversation) {
      setMessages(activeConversation.messages);
    }
  }, [activeConversation]);

  // Handle incoming messages from socket
  useEffect(() => {
    socket.on("receive_message", (message) => {
      if (activeConversation?._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [activeConversation]);

  const sendMessage = async (data) => {
    try {
      if (data.message.trim() && user) {
        if (activeConversation) {
          // If active conversation exists, just send the message
          const messageData = {
            senderId: userId,
            conversationId: activeConversation._id || conversationId,
            content: data.message,
          };
          socket.emit("send_message", messageData, (response) => {
            if (response.status === "ok") {
              setMessages((prev) => [...prev, response.message]);
            } else {
              console.error("Error sending message:", response.error);
            }
          });
        } else {
          // If no active conversation, create a new one and send the message
          const createdConversation = await createConversation({
            senderId: userId,
            receiverId,
          }).unwrap();

          if (createdConversation) {
            setActiveConversation(createdConversation);
            setMessages(createdConversation.messages);
            const messageData = {
              senderId: userId,
              conversationId: createdConversation._id,
              content: data.message,
            };
            socket.emit("send_message", messageData, (response) => {
              if (response.status === "ok") {
                setMessages((prev) => [...prev, response.message]);
              } else {
                console.error("Error sending message:", response.error);
              }
            });
          }
        }
        reset();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-[60vh] w-1/2 mx-auto bg-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 py-2 px-4 bg-primary text-white rounded-md shadow-md">
        <span className="text-xl font-semibold">Chat</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md p-4 space-y-4">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`rounded-lg max-w-fit p-4 ${
              msg.sender === userId
                ? "bg-primary text-white ml-auto"
                : "bg-gray-100 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSubmit(sendMessage)}
        className="flex items-center gap-2 mt-4 bg-white shadow-md rounded-md px-4 py-2"
      >
        <input
          {...register("message")}
          type="text"
          placeholder="Type a message..."
          className="border-2 border-gray-300 rounded-lg p-2 flex-1 text-lg focus:border-none focus:outline-none focus:ring-[1.5px] focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 active:scale-95 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;

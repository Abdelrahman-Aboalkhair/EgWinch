"use client";
import { useAppSelector } from "@/app/store/hooks";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import {
  useCreateConversationMutation,
  useGetConversationsQuery,
} from "@/app/libs/features/apis/ConversationApi";
import { Send } from "lucide-react"; // Import Send icon
import Link from "next/link";

// Create socket instance outside component to prevent recreation
const socket = io("http://localhost:5000");

const ChatPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || user?._id;
  const { receiverId } = useParams();
  const conversationId = useSearchParams().get("conversationId");
  const { register, handleSubmit, reset } = useForm();

  const [createConversation] = useCreateConversationMutation();
  const { data: conversations } = useGetConversationsQuery({}, { skip: !user });

  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  // Find or set active conversation
  useEffect(() => {
    if (!conversations) return;

    const conversation = conversationId
      ? conversations.find((conv) => conv._id === conversationId)
      : conversations.find(
          (conv) =>
            conv.participants.some((p) => p._id === receiverId) &&
            conv.participants.some((p) => p._id === userId)
        );

    setActiveConversation(conversation);
    if (conversation) {
      setMessages(conversation.messages);
    }
  }, [conversations, conversationId, receiverId, userId]);

  // Handle real-time messages
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (activeConversation?._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [activeConversation]);

  // Handle sending messages
  const handleSendMessage = useCallback(
    async (data) => {
      if (!data.message.trim() || !user) return;

      try {
        if (activeConversation) {
          // Send message in existing conversation
          const messageData = {
            senderId: userId,
            conversationId: activeConversation._id,
            receiverId,
            content: data.message,
          };
          await sendMessageToSocket(messageData);
        } else {
          // Create new conversation and send message
          const newConversation = await createConversation({
            senderId: userId,
            receiverId,
          }).unwrap();

          setActiveConversation(newConversation);
          setMessages(newConversation.messages);

          const messageData = {
            senderId: userId,
            conversationId: newConversation._id,
            receiverId,
            content: data.message,
          };
          await sendMessageToSocket(messageData);
        }
        reset();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [activeConversation, userId, receiverId, createConversation, reset]
  );

  // Helper function to send message via socket
  const sendMessageToSocket = (messageData) => {
    return new Promise((resolve, reject) => {
      socket.emit("send_message", messageData, (response) => {
        if (response.status === "ok") {
          setMessages((prev) => [...prev, response.message]);
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  };

  if (!user) {
    return <div>Please login to chat</div>;
  }

  return (
    <main className="flex flex-col max-h-[80vh] py-10 max-w-5xl mx-auto bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <Link href={"/dashboard"}>
        <button className="bg-primary text-white py-2 px-4 rounded-lg shadow-md">
          Back
        </button>
      </Link>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-primary text-white">
        <span className="text-xl font-semibold">
          Chat with{" "}
          {activeConversation?.participants.find((p) => p._id === receiverId)
            ?.name || "Driver"}
        </span>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`flex ${
              msg.sender === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.sender === userId
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-white text-gray-800 shadow-md rounded-bl-none"
              }`}
            >
              <p className="break-words">{msg.content}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSubmit(handleSendMessage)}
        className="p-4 bg-white border-t border-gray-200"
      >
        <div className="flex gap-2">
          <input
            {...register("message")}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 active:scale-95 transition-all duration-200"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </main>
  );
};

export default ChatPage;

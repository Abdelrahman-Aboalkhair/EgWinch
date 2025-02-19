"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Send, X } from "lucide-react";
import { useGetConversationsQuery } from "../libs/features/apis/ConversationApi";
import { useAppSelector, useAppDispatch } from "@/app/libs/hooks";
import Image from "next/image";
import UserImage from "../assets/user.png";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import {
  setConversations,
  sendMessage,
  setActiveConversation,
  markMessagesAsRead,
} from "../libs/features/slices/ConversationSlice";

const socket = io("http://localhost:5000");

const Conversations = () => {
  const { handleSubmit, reset, register } = useForm();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { conversations, activeConversation } = useAppSelector(
    (state) => state.conversations
  );

  const userId = user?.id || user?._id;
  const { data, isLoading, error } = useGetConversationsQuery({});
  dispatch(setConversations(data));

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (data) {
      dispatch(setConversations(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (activeConversation) {
      socket.emit("mark_as_read", activeConversation._id, userId);
      dispatch(
        markMessagesAsRead({
          conversationId: activeConversation._id,
          userId,
        })
      );
    }
  }, [activeConversation, dispatch, userId]);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      if (activeConversation?._id === message.conversation) {
        dispatch(sendMessage(message));
      }
    });
    return () => {
      socket.off("receive_message");
    };
  }, [activeConversation, dispatch]);

  const handleSendMessage = async (data) => {
    if (data.message.trim() && user && activeConversation) {
      const messageData = {
        senderId: userId,
        receiverId: activeConversation.participants.find((p) => p !== userId),
        conversationId: activeConversation._id,
        content: data.message,
      };

      socket.emit("send_message", messageData, (response) => {
        if (response.status === "ok") {
          dispatch(sendMessage(response.message));
        }
      });
      reset();
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-full shadow-md hover:bg-green-600 transition"
      >
        {isOpen ? <X /> : <ChevronDown />} Conversations
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="absolute bottom-16 right-6 w-80 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error loading conversations</p>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => dispatch(setActiveConversation(conversation))}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition ${
                    activeConversation?._id === conversation._id
                      ? "bg-green-100"
                      : ""
                  }`}
                >
                  <Image src={UserImage} alt="User" width={40} height={40} />
                  <p>
                    {conversation.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {activeConversation && (
        <div className="fixed bottom-16 right-6 w-[400px] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col max-h-[500px]">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <Image
                src={UserImage}
                alt="User"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold">
                  {
                    activeConversation.participants.find(
                      (p) => p._id !== userId
                    )?.name
                  }
                </h3>
                <span className="text-xs text-green-500">Online</span>
              </div>
            </div>
            <button
              onClick={() => dispatch(setActiveConversation(null))}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {activeConversation.messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === userId
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <p className="break-words">{msg.content}</p>
                  <span className="text-xs mt-1 block opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Form */}
          <form
            className="p-3 bg-white border-t border-gray-200"
            onSubmit={handleSubmit(handleSendMessage)}
          >
            <div className="flex items-center gap-2">
              <input
                {...register("message")}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Conversations;

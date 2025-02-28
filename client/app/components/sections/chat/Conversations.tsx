"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Send, X } from "lucide-react";
import { useGetConversationsQuery } from "../../../store/apis/ConversationApi";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import Image from "next/image";
import UserImage from "@/app/assets/icons/user.png";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import {
  setConversations,
  sendMessage,
  setActiveConversation,
  markMessagesAsRead,
  updateUnreadCount,
} from "../../../store/slices/ConversationSlice";

const Conversations = () => {
  const { handleSubmit, reset, register } = useForm();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { conversations, activeConversation } = useAppSelector(
    (state) => state.conversations
  );

  const userId = user?.id || user?._id;
  const { data, isLoading, error } = useGetConversationsQuery({});

  const [isOpen, setIsOpen] = useState(false);
  const lastMarkedConversationRef = useRef(null);

  const socketRef = useRef(null);

  useEffect(() => {
    if (userId) {
      socketRef.current = io("http://localhost:5000", {
        reconnection: true,
        reconnectionDelay: 1000,
      });

      socketRef.current.emit("join", userId);

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [userId]);

  useEffect(() => {
    if (data) {
      dispatch(setConversations(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!activeConversation) {
      lastMarkedConversationRef.current = null;
    }
  }, [activeConversation]);

  // Separate socket listeners into one useEffect
  useEffect(() => {
    // Message receiving
    const handleReceiveMessage = (message) => {
      console.log("Received message:", message);

      if (!message || !message.conversation) return;

      dispatch(sendMessage(message));
    };

    // Unread count updates
    const handleUnreadCount = ({ conversationId, userId, unreadCount }) => {
      console.log("Unread count update:", {
        conversationId,
        userId,
        unreadCount,
      });
      dispatch(
        updateUnreadCount({
          conversationId,
          userId,
          count: unreadCount,
        })
      );
    };

    socketRef.current.on("receive_message", handleReceiveMessage);
    socketRef.current.on("update_unread_count", handleUnreadCount);

    return () => {
      socketRef.current.off("receive_message", handleReceiveMessage);
      socketRef.current.off("update_unread_count", handleUnreadCount);
    };
  }, [dispatch, userId]);

  // Handle marking messages as read when opening a conversation
  useEffect(() => {
    if (
      activeConversation &&
      userId &&
      activeConversation.unreadCount?.[userId] > 0
    ) {
      console.log("Marking messages as read:", {
        conversationId: activeConversation._id,
        userId,
      });

      socketRef.current.emit(
        "mark_as_read",
        activeConversation._id,
        userId,
        (response) => {
          if (response?.status === "ok") {
            dispatch(
              markMessagesAsRead({
                conversationId: activeConversation._id,
                userId,
              })
            );
          }
        }
      );
    }
  }, [activeConversation?._id, userId]);

  const receiver = activeConversation?.participants.find((p) => p !== userId);

  const handleSendMessage = async (data) => {
    if (!data.message.trim() || !userId || !activeConversation) return;

    const messageData = {
      conversationId: activeConversation._id,
      senderId: userId,
      receiverId: receiver?._id,
      content: data.message,
    };

    console.log("Sending message:", messageData);

    socketRef.current.emit("send_message", messageData, (response) => {
      if (response.status === "ok") {
        console.log("Message sent successfully:", response.message);
        dispatch(sendMessage({ ...response.message, sender: userId }));
        reset();
      } else {
        console.error("Failed to send message:", response.error);
      }
    });
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
              conversations.map((conversation) => {
                const unreadCount = conversation.unreadCount?.[userId] || 0;
                console.log("unread count: ", unreadCount);
                return (
                  <div
                    key={conversation._id}
                    onClick={() =>
                      dispatch(setActiveConversation(conversation._id))
                    }
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition relative ${
                      activeConversation?._id === conversation._id
                        ? "bg-green-100"
                        : ""
                    } ${unreadCount > 0 ? "font-bold" : "font-normal"}`}
                  >
                    <Image src={UserImage} alt="User" width={40} height={40} />
                    <p>
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>

                    {unreadCount > 0 && (
                      <span
                        key={conversation._id}
                        className="absolute right-3 top-1 bg-primary text-white text-xs font-bold px-[12px] py-[6px] rounded-full"
                      >
                        {unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {activeConversation && (
        <div
          key={activeConversation._id}
          className="fixed bottom-16 right-6 w-[400px] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col max-h-[500px]"
        >
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {activeConversation.messages.map((msg, index) => (
              <div
                key={msg._id || `msg-${index}`}
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

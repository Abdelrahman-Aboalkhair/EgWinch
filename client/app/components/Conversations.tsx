"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Send, X } from "lucide-react";
import { useGetConversationsQuery } from "../libs/features/apis/ConversationApi";
import { useAppSelector, useAppDispatch } from "@/app/libs/hooks";
import Image from "next/image";
import UserImage from "../assets/user.png";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import {
  setActiveConversation,
  addMessageToConversation,
  markMessagesAsRead,
  updateUnreadCount,
} from "../libs/features/slices/ConversationSlice";

const socket = io("http://localhost:5000");

const Conversations = () => {
  const { handleSubmit, reset, register } = useForm();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeConversationId, conversations } = useAppSelector(
    (state) => state.conversations
  );
  const userId = user?.id || user?._id;

  const activeConversation = conversations.find(
    (conv) => conv._id === activeConversationId
  );

  // Handle marking messages as read when conversation becomes active
  useEffect(() => {
    if (activeConversationId && userId) {
      socket.emit("join_conversation", activeConversationId);

      socket.emit("mark_as_read", activeConversationId, userId, (response) => {
        if (response?.status === "ok") {
          dispatch(
            markMessagesAsRead({
              conversationId: activeConversationId,
              userId,
            })
          );
        }
      });
    }
  }, [activeConversationId, userId, dispatch]);

  // Handle incoming messages
  useEffect(() => {
    socket.on("receive_message", (message) => {
      if (message.conversationId) {
        dispatch(
          addMessageToConversation({
            conversationId: message.conversationId,
            message,
          })
        );
      }
    });

    socket.on(
      "update_unread_count",
      ({ userId: updatedUserId, conversationId, unreadCount }) => {
        if (updatedUserId === userId) {
          dispatch(
            updateUnreadCount({
              conversationId,
              userId: updatedUserId,
              count: unreadCount,
            })
          );
        }
      }
    );

    return () => {
      socket.off("receive_message");
      socket.off("update_unread_count");
    };
  }, [dispatch, userId]);

  const handleSendMessage = async (data) => {
    if (data.message.trim() && user && activeConversation) {
      const messageData = {
        senderId: userId,
        conversationId: activeConversation._id,
        content: data.message,
      };

      socket.emit("send_message", messageData, (response) => {
        if (response.status === "ok") {
          dispatch(
            addMessageToConversation({
              conversationId: activeConversation._id,
              message: response.message,
            })
          );
        }
      });

      reset();
    }
  };

  return (
    <div className="fixed bottom-0 right-2 z-[10000] w-[350px]">
      <div className="flex items-center justify-between mb-2 border-b-2 border-gray-200">
        <h2 className="text-gray-800 font-medium px-4 py-2">
          {receiver?.name}
        </h2>
        <button
          onClick={() => dispatch(setActiveConversation(null))}
          className="text-gray-800"
        >
          <X />
        </button>
      </div>

      <AnimatePresence>
        {!activeConversationId ? (
          <motion.div
            className="max-h-[400px] overflow-y-auto bg-white"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {conversations?.map((conversation) => {
              const receiver = conversation.participants.find(
                (p) => p._id !== userId
              );
              const unreadCount = conversation.unreadCount[userId] || 0;

              return (
                <div
                  key={conversation._id}
                  className={`p-4 cursor-pointer transition-all ${
                    activeConversationId === conversation._id
                      ? "bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    dispatch(setActiveConversation(conversation._id))
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                      <div>
                        <h3 className="font-medium">{receiver?.name}</h3>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage?.content}
                        </p>
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-primary text-white rounded-full px-2 py-1 text-xs">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-t-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Chat messages */}
            <div className="max-h-[400px] overflow-y-auto p-4">
              {activeConversation?.messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender === userId ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === userId
                        ? "bg-primary text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <form
              onSubmit={handleSubmit(handleSendMessage)}
              className="border-t p-4 flex gap-2"
            >
              <input
                {...register("message")}
                className="flex-1 border rounded-lg px-3 py-2"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="bg-primary text-white rounded-lg px-4 py-2"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Conversations;

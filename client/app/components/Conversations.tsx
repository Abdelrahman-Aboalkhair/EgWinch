"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Send, X } from "lucide-react";
import { useGetConversationsQuery } from "../libs/features/apis/ConversationApi";
import { useAppSelector } from "@/app/libs/hooks";
import Image from "next/image";

const Conversations = () => {
  const { user } = useAppSelector((state) => state.auth);
  const {
    data: conversations,
    isLoading,
    error,
  } = useGetConversationsQuery({});
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);

  if (isLoading) return null;
  if (error)
    return (
      <div className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded-lg shadow-lg">
        Error loading chats
      </div>
    );

  const closeChat = () => {
    setActiveConversation(null);
  };

  return (
    <div className="fixed bottom-0 right-2 z-[10000] w-[350px]">
      <div
        className="bg-white p-3 cursor-pointer flex items-center justify-between text-black border-b-2 border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-start gap-2">
          <Image
            className="rounded-full"
            alt="user"
            width={40}
            height={40}
            src={user.profilePicture.secure_url}
          />
          <h1 className="text-md font-semibold">Messaging</h1>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} />
        </motion.div>
      </div>

      <motion.div
        className="overflow-hidden"
        animate={{ opacity: 1, height: isOpen ? "auto" : 0 }}
        transition={{ opacity: 0, duration: 0.25, ease: "easeInOut" }}
        exit={{ opacity: 1, height: 0 }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div className=" bg-white shadow-lg p-3">
              <div className="max-h-80 overflow-y-auto space-y-4 py-2">
                {conversations.map((conversation) => {
                  const receiver = conversation.participants.find(
                    (p) => p._id !== user.id
                  );
                  return (
                    <div
                      key={conversation._id}
                      className={`p-4 cursor-pointer transition-all ${
                        activeConversation?._id === conversation._id
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="flex items-center justify-start gap-2">
                        <div className="rounded-full bg-gray-200 w-[40px] h-[40px]" />
                        <div>
                          <h2 className="text-gray-800 font-medium">
                            {receiver.name}
                          </h2>
                          <p className="text-sm text-gray-500 truncate">
                            {
                              conversation.messages[
                                conversation.messages.length - 1
                              ]?.content
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {activeConversation && (
        <div className="absolute bottom-0 right-[25rem] max-w-fit bg-white rounded-xl shadow-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2 border-b-2 border-gray-200">
            <h2 className="text-gray-800 font-medium px-4 py-2">
              {
                activeConversation.participants.find((p) => p._id !== user.id)
                  .name
              }
            </h2>
            <button onClick={closeChat} className="text-gray-800 ">
              <X />
            </button>
          </div>

          {/* Messages Section */}
          <div className="flex-1 overflow-y-auto space-y-3 bg-gray-50 p-4 rounded-lg mb-2 px-4">
            {activeConversation.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  msg.sender === user.id ? "self-end" : "self-start"
                }`}
              >
                {/* Sender's Avatar */}
                <div className="w-8 h-8 rounded-full bg-gray-200">
                  <Image
                    src={
                      msg.sender === user?.id
                        ? user?.profilePicture?.secure_url
                        : activeConversation?.participants?.find(
                            (p) => p._id !== user?.id
                          )?.profilePicture?.secure_url
                    }
                    alt="Sender Avatar"
                    width={40}
                    height={40}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {/* Message Content */}
                <div
                  className={`px-3 py-2 rounded-lg ${
                    msg.sender === user.id
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>{msg.content}</p>
                  <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                    {/* Timestamp */}
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>

                    {/* Message Status (Read/Unread) */}
                    <span
                      className={`${
                        msg.status === "read"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {msg.status === "read" ? "Read" : "Unread"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <form className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Conversations;

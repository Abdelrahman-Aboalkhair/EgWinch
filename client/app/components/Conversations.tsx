"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Send, X } from "lucide-react";
import { useGetConversationsQuery } from "../libs/features/apis/ConversationApi";
import { useAppSelector } from "@/app/libs/hooks";
import Image from "next/image";
import UserImage from "../assets/user.png";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";

const socket = io("http://localhost:5000");

const Conversations = () => {
  const { handleSubmit, reset, register } = useForm();
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || user?._id;
  const {
    data: conversations,
    isLoading,
    error,
  } = useGetConversationsQuery({});
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (activeConversation) {
      setMessages(activeConversation.messages);
    }
  }, [activeConversation]);

  useEffect(() => {
    if (activeConversation) {
      socket.emit("mark_as_read", activeConversation._id, userId);
    }
  }, [activeConversation]);

  // Handle incoming messages
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

  const receiver = activeConversation?.participants?.find(
    (participant) => participant._id !== userId
  );

  const receiverId = receiver?._id;

  const sendMessage = async (data) => {
    console.log("data: ", data);
    try {
      if (data.message.trim() && user && activeConversation) {
        const messageData = {
          senderId: userId,
          receiverId,
          conversationId: activeConversation._id,
          content: data.message,
        };

        const optimisticMessage = {
          ...messageData,
          createdAt: new Date().toISOString(),
          status: "pending",
        };
        setMessages((prev) => [...prev, optimisticMessage]);

        socket.emit("send_message", messageData, (response) => {
          if (response.status === "ok") {
            setMessages((prev) =>
              prev.map((msg) =>
                msg === optimisticMessage ? response.message : msg
              )
            );
          } else {
            // Remove the optimistic message if failed
            setMessages((prev) =>
              prev.filter((msg) => msg !== optimisticMessage)
            );
            console.error("Error sending message:", response.error);
          }
        });

        reset();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
            src={UserImage}
          />
          <h1 className="text-md font-semibold">Messaging</h1>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} />
        </motion.div>
      </div>

      <AnimatePresence>
        <motion.div
          className="max-h-[400px] overflow-y-auto"
          animate={{ opacity: 1, height: isOpen ? "auto" : 0 }}
          transition={{ opacity: 0, duration: 0.25, ease: "easeInOut" }}
          exit={{ opacity: 1, height: 0 }}
        >
          {isOpen && (
            <motion.div
              key={"conversations"}
              className=" bg-white shadow-lg p-3"
            >
              <div className="max-h-[200px] overflow-y-auto space-y-4 py-2">
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
        </motion.div>

        {activeConversation && (
          <div
            key={activeConversation._id}
            className="absolute bottom-0 max-h-[600px] right-[25rem] max-w-[500px] bg-white rounded-sm shadow-lg p-4 flex flex-col"
          >
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
              {messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${
                    msg.sender === user.id ? "self-end" : "self-start"
                  }`}
                >
                  {/* Sender's Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gray-200">
                    <Image
                      src={UserImage}
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
                    <div className="text-xs text-gray-200 mt-1 flex items-center justify-between gap-2">
                      {/* Timestamp */}
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>

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
            <form
              onSubmit={handleSubmit(sendMessage)}
              className="flex gap-2 mt-2"
            >
              <input
                {...register("message")}
                type="text"
                placeholder="Type a message..."
                className="border-2 border-gray-300 rounded-lg p-2 flex-1 text-lg focus:border-none focus:outline-none focus:ring-[1.5px] focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg"
              >
                <Send />
              </button>
            </form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Conversations;

"use client";

import { useState, useEffect } from "react";
import { Send, ArrowLeft, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { initSocket } from "../../SocketClient";

const ChatComponent = ({
  userId,
  receiverId,
}: {
  userId: string;
  receiverId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { senderId: string; message: string }[]
  >([]);
  const [socket, setSocket] = useState<any>(null);

  // useEffect(() => {
  //   const socketInstance = initSocket(userId);
  //   setSocket(socketInstance);

  //   // Listen for incoming messages
  //   socketInstance.on("newMessage", (newMessage) => {
  //     console.log("Received new message:", newMessage);
  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   });

  //   return () => {
  //     socketInstance.off("newMessage");
  //   };
  // }, [userId]);

  // const sendMessage = async () => {
  //   if (!message.trim()) return;

  //   const newMessage = { senderId: userId, receiverId, message };

  //   // Emit the message via Socket.io
  //   socket.emit("sendMessage", newMessage);

  //   // Optimistically update UI
  //   setMessages((prevMessages) => [...prevMessages, newMessage]);

  //   setMessage("");
  // };

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-[460px]">
      <div
        className="flex items-center justify-between p-4 bg-primary text-white rounded-t-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">Chat with Driver</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "400px" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-b-lg"
      >
        <Link href="/chat">
          <div className="flex items-center p-4 border-b border-gray-300 bg-white">
            <ArrowLeft className="w-6 h-6 text-primary cursor-pointer" />
            <h2 className="flex-1 text-lg font-semibold text-primary text-center">
              Chat with Driver
            </h2>
          </div>
        </Link>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-100 h-[250px]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === userId ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`p-3 rounded-lg shadow-md ${
                  msg.senderId === userId
                    ? "bg-primary text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex items-center p-4 border-t border-gray-300 bg-white">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-[1.5px] focus:ring-primary"
          />
          <button className="ml-2 p-2 bg-primary text-white rounded-full hover:opacity-90">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatComponent;

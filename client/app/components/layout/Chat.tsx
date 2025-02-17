"use client";
import { useEffect, useState } from "react";
import {
  Send,
  ArrowLeft,
  ChevronDown,
  MessageCircleCodeIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Input from "../custom/Input";
import { io } from "socket.io-client";
import { useAppSelector } from "@/app/libs/hooks";

const socket = io("http://localhost:5000");

const ChatComponent = ({
  driverId,
  userId,
}: {
  driverId: string;
  userId: string;
}) => {
  const { register, setValue, watch } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);

  useEffect(() => {
    const roomId = [userId, driverId].sort().join("_");
    console.log("roomId: ", roomId);
    socket.emit("joinRoom", { userId, driverId });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, driverId]);

  const messageInput = watch("message");
  const sendMessage = () => {
    const roomId = [userId, driverId].sort().join("_");
    socket.emit("sendMessage", {
      roomId,
      sender: userId,
      message: messageInput,
    });
    setMessages((prev) => [...prev, { sender: userId, message: messageInput }]);
    setValue("message", "");
  };

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

        <div className="flex items-center p-4 border-t border-gray-300 bg-white">
          <Input
            name="message"
            placeholder="Enter your message"
            register={register}
            className="py-[15px] text-[16px] truncate"
            icon={MessageCircleCodeIcon}
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-2 bg-primary text-white rounded-full hover:opacity-90"
          >
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatComponent;

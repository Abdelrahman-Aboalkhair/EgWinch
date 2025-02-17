"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, MessageCircleCodeIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Input from "../../components/custom/Input";
import { useAppSelector } from "@/app/libs/hooks";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import { useGetConverstationsQuery } from "@/app/libs/features/apis/ChatApi";

const Chat = () => {
  const {
    data: conversations,
    isLoading,
    error,
  } = useGetConverstationsQuery({});
  const socket = io("http://localhost:5000");
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id;
  const { id: driverId } = useParams();

  const { register, handleSubmit, setValue, watch } = useForm();
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);

  useEffect(() => {
    if (userId && driverId) {
      socket.emit("joinRoom", { userId, driverId });

      socket.on("recievedMessage", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [driverId, userId]);

  const sendMessage = (data: { message: string }) => {
    if (userId && driverId) {
      console.log("Sending message:", data.message);

      socket.emit("sendMessage", {
        sender: userId,
        message: data.message,
        driverId,
      });

      setValue("message", "");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-[460px]">
      <h1 className="text-3xl font-bold text-primary text-center">Chat app</h1>
      <div className="flex items-center justify-between p-4 bg-primary text-white rounded-t-lg cursor-pointer">
        <span className="font-semibold">Chat with Driver</span>
        <Link href="/chat">
          <ArrowLeft className="w-6 h-6 text-white cursor-pointer" />
        </Link>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "400px", opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-b-lg"
      >
        <div className="flex items-center p-4 border-b border-gray-300 bg-white">
          <h2 className="flex-1 text-lg font-semibold text-primary text-center">
            Chat with Driver
          </h2>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-100 h-[250px]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === userId ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`p-3 rounded-lg shadow-md ${
                  msg.sender === userId
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
          <form
            onSubmit={handleSubmit(sendMessage)}
            className="w-full flex items-center"
          >
            <Input
              name="message"
              placeholder="Enter your message"
              register={register}
              className="py-[15px] text-[16px] truncate"
              icon={MessageCircleCodeIcon}
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-primary text-white rounded-full hover:opacity-90"
            >
              Send
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;

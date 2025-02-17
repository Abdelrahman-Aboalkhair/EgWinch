"use client";
import { useEffect, useRef, useState } from "react";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "../../libs/features/apis/MessageApi";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/app/libs/hooks";
import { useForm } from "react-hook-form";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt: string;
}

const Chat = () => {
  const { id: driverId } = useParams();
  const { user } = useAppSelector((state) => state.auth);
  const { data: messages } = useGetMessagesQuery(driverId);
  const [sendMessage] = useSendMessageMutation();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000", {
      query: { userId: user?.id },
    });

    socket.current.on("newMessage", (message: Message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    if (messages) setChatMessages(messages);
  }, [messages]);

  // React Hook Form setup
  const { register, handleSubmit, reset } = useForm();

  const handleSendMessage = async (data: { message: string }) => {
    try {
      const newMessage = await sendMessage({
        text: data.message,
        receiverId: driverId,
      }).unwrap();

      setChatMessages((prev) => [...prev, newMessage]);
      reset(); // Reset input field after message is sent
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4">
      <div className="flex-1 overflow-y-auto">
        {chatMessages.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 ${
              msg.senderId === user?.id ? "text-right" : "text-left"
            }`}
          >
            <p className="bg-blue-500 text-white inline-block rounded-lg p-2">
              {msg.text}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <form
          onSubmit={handleSubmit(handleSendMessage)}
          className="flex w-full"
        >
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border p-2 rounded-lg"
            {...register("message", { required: true })}
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

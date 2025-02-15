"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

const Chat = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      {/* Chat Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl h-[80vh] bg-white border border-gray-200 shadow-lg rounded-lg"
      >
        {/* Chat Header */}
        <div className="flex items-center p-4 border-b border-gray-300 bg-white">
          <h2 className="flex-1 text-2xl font-semibold text-primary text-center">
            Chat with Driver
          </h2>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
          <div className="flex justify-start mb-2">
            <div className="bg-white text-gray-900 p-3 rounded-lg shadow-md max-w-xs">
              Hello, I’m on my way!
            </div>
          </div>
          <div className="flex justify-end mb-2">
            <div className="bg-primary text-white p-3 rounded-lg shadow-md max-w-xs">
              Alright, see you soon!
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="flex items-center p-4 border-t border-gray-300 bg-white">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-[1.5px] focus:ring-primary text-lg"
          />
          <button className="ml-3 p-3 bg-primary text-white rounded-full hover:opacity-90">
            <Send className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;

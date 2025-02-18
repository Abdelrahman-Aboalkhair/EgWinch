"use client";
import { useGetConversationsQuery } from "../libs/features/apis/ConversationApi";
import { useAppSelector } from "@/app/libs/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Conversations = () => {
  const { user } = useAppSelector((state) => state.auth);
  const {
    data: conversations,
    isLoading,
    error,
  } = useGetConversationsQuery({});

  const router = useRouter();

  const handleConversationClick = (
    conversationId: string,
    receiverId: string
  ) => {
    router.push(`/chat/${receiverId}?conversationId=${conversationId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl">Loading conversations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl text-red-500">
          Error loading conversations
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Your Conversations
      </h1>
      <div className="space-y-4">
        {conversations?.map((conversation) => {
          // Get the other participant (receiver)
          const receiver = conversation.participants.find(
            (participant) => participant._id !== user?.id
          );

          const lastMessage =
            conversation.messages[conversation.messages.length - 1];

          return (
            <div
              key={conversation._id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50"
              onClick={() =>
                handleConversationClick(conversation._id, receiver?._id)
              }
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 w-[50px] h-[50px]" />
                <div>
                  <h2 className="text-xl font-semibold">{receiver?.name}</h2>
                  <p className="text-sm text-gray-500">
                    {lastMessage?.content}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {lastMessage
                  ? new Date(lastMessage.createdAt).toLocaleTimeString()
                  : "No messages yet"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Conversations;

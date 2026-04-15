import React from "react";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import ConversationItem from "./ConversationItem";
import Spinner from "../ui/Spinner";

const ConversationList: React.FC = () => {
  const { conversations, isLoadingConversations } = useChatStore();
  const { user } = useAuthStore();

  if (isLoadingConversations) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-[#161b27] rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#8696a0]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646z" />
          </svg>
        </div>
        <p className="text-[#8696a0] text-sm">No conversations yet</p>
        <p className="text-[#8696a0] text-xs mt-1">Start a new chat to get going</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <ConversationItem key={conv._id} conversation={conv} currentUserId={user?._id || ""} />
      ))}
    </div>
  );
};

export default ConversationList;

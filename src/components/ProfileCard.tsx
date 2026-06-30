import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useStore } from "@/store/useStore";
import { Plus, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
}

function formatFollowersLocal(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M followers";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K followers";
  return count + " followers";
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
  searchQuery,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { selectedProfiles, addProfile, removeProfile } = useStore();
  
  const isAdded = selectedProfiles.some((p) => p.username === profile.username);

  const handleClick = () => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleToggleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdded) {
      removeProfile(profile.username);
    } else {
      addProfile(profile);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      onClick={handleClick}
      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl mb-3 cursor-pointer shadow-sm hover:shadow-md hover:border-blue-200 transition-all w-full max-w-2xl"
      data-search={searchQuery}
    >
      <img 
        src={profile.picture} 
        alt={profile.username}
        className="w-14 h-14 rounded-full object-cover shadow-sm border border-gray-100" 
      />
      
      <div className="text-left flex-1">
        <div className="font-bold text-gray-900 text-lg flex items-center gap-1">
          @{profile.username}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm font-medium text-gray-500">{profile.fullname}</div>
        <div className="text-sm text-gray-700 mt-0.5">{formatFollowersLocal(profile.followers)}</div>
      </div>
      
      <button
        className={`px-4 py-2 text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors ${
          isAdded 
            ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100" 
            : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
        }`}
        onClick={handleToggleAdd}
      >
        {isAdded ? (
          <>
            <Check size={16} /> Added
          </>
        ) : (
          <>
            <Plus size={16} /> Add to List
          </>
        )}
      </button>
    </motion.div>
  );
});

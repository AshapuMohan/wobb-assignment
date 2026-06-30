import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { AnimatePresence } from "framer-motion";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
}

export function ProfileList({
  profiles,
  platform,
  searchQuery,
}: ProfileListProps) {
  return (
    <div className="flex flex-col items-center w-full pb-10">
      {profiles.length === 0 && (
        <div className="mt-12 text-gray-500 text-center">
          <p className="text-lg font-medium">No profiles found</p>
          <p className="text-sm mt-1">Try adjusting your search query</p>
        </div>
      )}
      <div className="w-full flex flex-col items-center">
        <AnimatePresence>
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.user_id}
              profile={profile}
              platform={platform}
              searchQuery={searchQuery}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

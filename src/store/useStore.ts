import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

interface StoreState {
  platform: Platform;
  searchQuery: string;
  selectedProfiles: UserProfileSummary[];
  
  setPlatform: (platform: Platform) => void;
  setSearchQuery: (query: string) => void;
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (username: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      platform: "instagram",
      searchQuery: "",
      selectedProfiles: [],
      
      setPlatform: (platform) => set({ platform, searchQuery: "" }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      addProfile: (profile) =>
        set((state) => {
          if (state.selectedProfiles.some((p) => p.username === profile.username)) {
            return state; // Prevent duplicates
          }
          return { selectedProfiles: [...state.selectedProfiles, profile] };
        }),
      removeProfile: (username) =>
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(
            (p) => p.username !== username
          ),
        })),
    }),
    {
      name: "influencer-storage", // local storage key
    }
  )
);

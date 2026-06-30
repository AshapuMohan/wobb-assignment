import { useStore } from "@/store/useStore";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useMemo } from "react";

export function SearchPage() {
  const { platform, setPlatform, searchQuery, setSearchQuery } = useStore();

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  return (
    <Layout title="Find Influencers">
      <p className="text-gray-500 mb-6 text-base max-w-2xl">
        Browse top creators across social platforms. Filter by platform and search for specific creators to build your list.
      </p>

      <PlatformFilter
        selected={platform}
        onChange={setPlatform}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex items-center justify-between mb-4 w-full max-w-2xl mx-auto">
        <p className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Showing {filtered.length} of {allProfiles.length} on {platform}
        </p>
      </div>

      <ProfileList
        profiles={filtered}
        platform={platform}
        searchQuery={searchQuery}
      />
    </Layout>
  );
}

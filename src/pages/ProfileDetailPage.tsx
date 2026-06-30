import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useStore } from "@/store/useStore";
import { ArrowLeft, Check, Plus, ExternalLink, Activity, Users, Eye, Heart, MessageCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-500">{label}</div>
        <div className="font-bold text-gray-900 text-lg">{value}</div>
      </div>
    </div>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const urlPlatform = searchParams.get("platform");
  const { platform, selectedProfiles, addProfile, removeProfile } = useStore();
  
  const displayPlatform = urlPlatform || platform || "unknown";

  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800">Invalid profile</h2>
          <Link to="/" className="text-blue-600 mt-4 inline-block hover:underline">Return to Search</Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
          <p className="text-red-600 mb-4 font-semibold text-lg">
            Could not load profile details for {username}
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
            <ArrowLeft size={16} /> Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const isAdded = selectedProfiles.some((p) => p.username === user.username);

  const handleToggleAdd = () => {
    if (isAdded) {
      removeProfile(user.username);
    } else {
      addProfile(user);
    }
  };

  return (
    <Layout title={user.fullname}>
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Search
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <img
              src={user.picture}
              alt={user.fullname}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 flex items-center gap-2">
                    @{user.username}
                    <VerifiedBadge verified={user.is_verified} />
                  </h2>
                  <p className="text-lg text-gray-600 font-medium">{user.fullname}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {user.url && (
                    <a
                      href={user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors"
                    >
                      <ExternalLink size={18} /> Visit Profile
                    </a>
                  )}
                  <button
                    onClick={handleToggleAdd}
                    className={`inline-flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all shadow-sm ${
                      isAdded 
                        ? "bg-green-500 text-white hover:bg-green-600 hover:shadow-md" 
                        : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                    }`}
                  >
                    {isAdded ? (
                      <><Check size={18} /> In List</>
                    ) : (
                      <><Plus size={18} /> Add to List</>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mt-3 flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-lg">
                  {displayPlatform}
                </span>
                {(user.gender || user.age_group) && (
                  <span className="text-sm text-gray-500">
                    {user.gender} {user.age_group}
                  </span>
                )}
              </div>

              {user.description && (
                <p className="mt-6 text-gray-700 leading-relaxed max-w-2xl">
                  {user.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard 
            icon={<Users size={24} />} 
            label="Followers" 
            value={formatFollowersDetail(user.followers)} 
          />
          <StatCard 
            icon={<Activity size={24} />} 
            label="Engagement Rate" 
            value={user.engagement_rate !== undefined ? `${(user.engagement_rate * 100).toFixed(2)}%` : "N/A"} 
          />
          {user.engagements !== undefined && (
            <StatCard 
              icon={<Heart size={24} />} 
              label="Engagements" 
              value={formatEngagementRate(user.engagement_rate)} 
            />
          )}
          {user.posts_count !== undefined && (
            <StatCard 
              icon={<FileText size={24} />} 
              label="Posts" 
              value={user.posts_count.toLocaleString()} 
            />
          )}
          {user.avg_likes !== undefined && (
            <StatCard 
              icon={<Heart size={24} />} 
              label="Avg Likes" 
              value={formatFollowersDetail(user.avg_likes)} 
            />
          )}
          {user.avg_comments !== undefined && (
            <StatCard 
              icon={<MessageCircle size={24} />} 
              label="Avg Comments" 
              value={formatFollowersDetail(user.avg_comments)} 
            />
          )}
          {user.avg_views !== undefined && user.avg_views > 0 && (
            <StatCard 
              icon={<Eye size={24} />} 
              label="Avg Views" 
              value={formatFollowersDetail(user.avg_views)} 
            />
          )}
        </div>
      </motion.div>
    </Layout>
  );
}

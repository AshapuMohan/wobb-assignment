import { useStore } from "@/store/useStore";
import { X, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function SelectedListSidebar() {
  const { selectedProfiles, removeProfile, platform } = useStore();

  if (selectedProfiles.length === 0) {
    return (
      <div className="w-80 bg-white border-l h-screen fixed right-0 top-0 p-6 flex flex-col items-center justify-center text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-400">
          <Users size={32} />
        </div>
        <h3 className="font-semibold text-lg text-gray-800">No Influencers Selected</h3>
        <p className="text-sm text-gray-500 mt-2">
          Find and add influencers to your list to compare them.
        </p>
      </div>
    );
  }

  const handleExport = () => {
    if (selectedProfiles.length === 0) return;

    const headers = ["Username", "Full Name", "Followers", "Engagement Rate", "URL"];
    const csvContent = [
      headers.join(","),
      ...selectedProfiles.map(p => {
        const engagementRate = p.engagement_rate ? (p.engagement_rate * 100).toFixed(2) + "%" : "N/A";
        return [
          `"${p.username}"`,
          `"${p.fullname}"`,
          p.followers,
          `"${engagementRate}"`,
          `"${p.url}"`
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "influencers_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-80 bg-gray-50 border-l h-screen fixed right-0 top-0 flex flex-col shadow-xl z-20">
      <div className="p-6 border-b bg-white flex justify-between items-center">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Users className="text-blue-600" size={20} />
          My List ({selectedProfiles.length})
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {selectedProfiles.map((profile) => (
          <div 
            key={profile.username} 
            className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 group relative transition-all hover:shadow-md"
          >
            <Link to={`/profile/${profile.username}?platform=${platform}`} className="flex-1 flex items-center gap-3 overflow-hidden">
              <img 
                src={profile.picture} 
                alt={profile.username} 
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <div className="overflow-hidden">
                <div className="font-semibold text-sm truncate w-32">{profile.fullname}</div>
                <div className="text-xs text-gray-500">@{profile.username}</div>
              </div>
            </Link>
            <button 
              onClick={() => removeProfile(profile.username)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Remove"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t bg-white">
        <button 
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
          onClick={handleExport}
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}

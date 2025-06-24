import { IVideo } from "@/app/(dashboard)/videos/page";
import { TrashIcon } from "@heroicons/react/24/outline";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

type VideoCardProps = {
  video: IVideo;
  onUpdate: () => void;
};

// Function to get YouTube video ID from URL
const getYouTubeId = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export function VideoCard({ video, onUpdate }: VideoCardProps) {
  const { user } = useAuth();
  const videoId = getYouTubeId(video.url);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await api.delete(`/videos/${id}`);
        toast.success("Video deleted!");
        onUpdate();
      } catch (error) {
        toast.error("Failed to delete video.");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {videoId && (
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      )}
      <div className="p-4 flex-grow flex flex-col">
        <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full self-start">
          {video.category}
        </span>
        <h3 className="font-semibold text-lg mt-2 text-gray-800">
          {video.title}
        </h3>
        <p className="text-gray-600 mt-2 text-sm flex-grow">
          {video.description}
        </p>
        <div className="mt-4 flex justify-between items-center pt-2 border-t">
          <p className="text-xs text-gray-500">
            Uploaded by {video.uploadedBy.name}
          </p>
          {(user?.role === "ADMIN" || user?._id === video.uploadedBy._id) && (
            <button
              onClick={() => handleDelete(video._id)}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

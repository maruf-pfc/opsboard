"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { PlusIcon } from "@heroicons/react/24/solid";
import { VideoCard } from "@/components/videos/VideoCard";
import { VideoModal } from "@/components/videos/VideoModal";

export interface IVideo {
  _id: string;
  title: string;
  description?: string;
  url: string;
  category: "Data Structures" | "Algorithms" | "System Design" | "Behavioral";
  uploadedBy: { _id: string; name: string };
  createdAt: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/videos");
      setVideos(data);
    } catch (error) {
      toast.error("Failed to fetch videos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Problem Solving Videos
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5" />
          Add Video
        </button>
      </div>

      {isLoading ? (
        <p>Loading videos...</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} onUpdate={fetchVideos} />
          ))}
        </div>
      )}

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={fetchVideos}
      />
    </div>
  );
}

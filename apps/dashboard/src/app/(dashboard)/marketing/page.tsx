"use client";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { CampaignTable } from "@/components/marketing/CampaignTable";
import { CampaignModal } from "@/components/marketing/CampaignModal";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export interface ICampaign {
  _id: string;
  subject: string;
  body: string;
  status: "Draft" | "Sent";
  sentAt?: string;
  createdBy: { name: string };
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<ICampaign | null>(null);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      // Assume you have a GET /marketing endpoint
      const { data } = await api.get("/marketing/campaigns");
      setCampaigns(data);
    } catch (error) {
      toast.error("Failed to fetch campaigns.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // fetchCampaigns(); // Uncomment when backend is ready
  }, []);

  const handleModalOpen = (campaign: ICampaign | null = null) => {
    setCampaignToEdit(campaign);
    setIsModalOpen(true);
  };

  return (
    <AdminRoute>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Email Marketing</h1>
          <button
            onClick={() => handleModalOpen()}
            className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5" />
            New Campaign
          </button>
        </div>
        <CampaignTable
          campaigns={campaigns}
          onEdit={handleModalOpen}
          onUpdate={fetchCampaigns}
        />
        <CampaignModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={fetchCampaigns}
          campaignToEdit={campaignToEdit}
        />
      </div>
    </AdminRoute>
  );
}

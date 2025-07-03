'use client';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { CampaignTable } from '@/components/marketing/CampaignTable';
import { CampaignModal } from '@/components/marketing/CampaignModal';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export interface ICampaign {
  _id: string;
  subject: string;
  body: string;
  status: 'Draft' | 'Sent';
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
      const { data } = await api.get('/marketing/campaigns');
      setCampaigns(data);
    } catch (error) {
      toast.error('Failed to fetch campaigns.');
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
      <div className="space-y-8 px-2 sm:px-4 md:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Email Marketing</h1>
          <p className="text-gray-600 mt-1">
            Manage and send email campaigns to your users.
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Campaigns</h2>
            <button
              onClick={() => handleModalOpen()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            >
              <PlusIcon className="h-5 w-5 mr-2" /> New Campaign
            </button>
          </div>
          <CampaignTable
            campaigns={campaigns}
            onEdit={handleModalOpen}
            onUpdate={fetchCampaigns}
          />
        </div>
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

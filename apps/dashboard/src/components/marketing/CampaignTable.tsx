import { ICampaign } from "@/app/(dashboard)/marketing/page";
import {
  PencilIcon,
  TrashIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { classNames } from "@/lib/utils";

type CampaignTableProps = {
  campaigns: ICampaign[];
  onEdit: (campaign: ICampaign) => void;
  onUpdate: () => void;
};

export function CampaignTable({
  campaigns,
  onEdit,
  onUpdate,
}: CampaignTableProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this draft? This cannot be undone.")) {
      try {
        await api.delete(`/marketing/campaigns/${id}`);
        toast.success("Campaign deleted!");
        onUpdate();
      } catch (error) {
        toast.error("Failed to delete campaign.");
      }
    }
  };

  const handleSend = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to send this campaign to all users?"
      )
    ) {
      try {
        await api.post(`/marketing/campaigns/${id}/send`);
        toast.success("Campaign is being sent!");
        onUpdate();
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to send campaign.");
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Subject
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Sent At
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {campaigns.map((campaign) => (
            <tr key={campaign._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {campaign.subject}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={classNames(
                    campaign.status === "Sent"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800",
                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  )}
                >
                  {campaign.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {campaign.sentAt
                  ? format(new Date(campaign.sentAt), "PPp")
                  : "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                {campaign.status === "Draft" && (
                  <>
                    <button
                      onClick={() => handleSend(campaign._id)}
                      title="Send"
                      className="text-green-600 hover:text-green-900"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEdit(campaign)}
                      title="Edit"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(campaign._id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

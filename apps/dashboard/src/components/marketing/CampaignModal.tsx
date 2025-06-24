import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ICampaign } from '@/app/(dashboard)/marketing/page';

type CampaignModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  campaignToEdit?: ICampaign | null;
};

export function CampaignModal({ isOpen, onClose, onUpdate, campaignToEdit }: CampaignModalProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (campaignToEdit) {
      setSubject(campaignToEdit.subject);
      setBody(campaignToEdit.body);
    } else {
      setSubject('');
      setBody('');
    }
  }, [campaignToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) {
        toast.error("Subject and body are required.");
        return;
    }
    const campaignData = { subject, body };
    try {
        if (campaignToEdit) {
            await api.put(`/marketing/campaigns/${campaignToEdit._id}`, campaignData);
            toast.success('Campaign draft updated!');
        } else {
            await api.post('/marketing/campaigns', campaignData);
            toast.success('Campaign draft saved!');
        }
        onUpdate();
        onClose();
    } catch (error: any) {
        toast.error(error.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                {campaignToEdit ? 'Edit Campaign Draft' : 'Create New Campaign'}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <input id="subject" type="text" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                  </div>
                  <div>
                    <label htmlFor="body" className="block text-sm font-medium text-gray-700">Email Body (HTML is supported)</label>
                    <textarea id="body" value={body} onChange={e => setBody(e.target.value)} required rows={10} className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono"/>
                  </div>
                 <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">Save Draft</button>
                  </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
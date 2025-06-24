import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

type VideoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
};

const categories = ['Data Structures', 'Algorithms', 'System Design', 'Behavioral'];

export function VideoModal({ isOpen, onClose, onUpdate }: VideoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.post('/videos', { title, description, url, category });
        toast.success('Video added!');
        onUpdate();
        onClose();
        // Reset state
        setTitle(''); setDescription(''); setUrl(''); setCategory(categories[0]);
    } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to add video.');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* ... (Backdrop from other modals) ... */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl">
              <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">Add New Video</Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                 <div>
                    <label>Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full mt-1 rounded-md border-gray-300"/>
                  </div>
                   <div>
                    <label>YouTube URL</label>
                    <input type="url" value={url} onChange={e => setUrl(e.target.value)} required className="w-full mt-1 rounded-md border-gray-300"/>
                  </div>
                   <div>
                    <label>Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 rounded-md border-gray-300">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                   <div>
                    <label>Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 rounded-md border-gray-300"/>
                  </div>
                 <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
                    <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white">Save Video</button>
                  </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
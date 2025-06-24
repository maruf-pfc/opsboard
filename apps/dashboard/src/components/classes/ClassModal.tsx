import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { IClass } from '@/app/(dashboard)/classes/page';

interface User { _id: string; name: string; }

type ClassModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  classToEdit?: IClass | null;
};

export function ClassModal({ isOpen, onClose, onUpdate, classToEdit }: ClassModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [schedule, setSchedule] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
        const { data } = await api.get('/users');
        setUsers(data);
    };
    if (isOpen) {
        fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (classToEdit) {
      setTitle(classToEdit.title);
      setDescription(classToEdit.description || '');
      setTrainerId(classToEdit.trainer._id);
      setSchedule(new Date(classToEdit.schedule).toISOString().slice(0, 16));
    } else {
      setTitle('');
      setDescription('');
      setTrainerId('');
      setSchedule('');
    }
  }, [classToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const classData = { title, description, trainer: trainerId, schedule };
    try {
        if (classToEdit) {
            await api.put(`/classes/${classToEdit._id}`, classData);
            toast.success('Class updated!');
        } else {
            await api.post('/classes', classData);
            toast.success('Class created!');
        }
        onUpdate();
        onClose();
    } catch (error) {
        toast.error('An error occurred.');
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {classToEdit ? 'Edit Class' : 'Create New Class'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Form fields */}
                  <div>
                    <label htmlFor="title">Title</label>
                    <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full mt-1 rounded-md border-gray-300"/>
                  </div>
                  <div>
                    <label htmlFor="trainer">Trainer</label>
                    <select id="trainer" value={trainerId} onChange={e => setTrainerId(e.target.value)} required className="w-full mt-1 rounded-md border-gray-300">
                        <option value="" disabled>Select a trainer</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="schedule">Schedule</label>
                    <input id="schedule" type="datetime-local" value={schedule} onChange={e => setSchedule(e.target.value)} required className="w-full mt-1 rounded-md border-gray-300"/>
                  </div>
                   <div>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 rounded-md border-gray-300"/>
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">Save</button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
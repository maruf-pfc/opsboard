'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/solid';
import { ClassTable } from '@/components/classes/ClassTable';
import { ClassModal } from '@/components/classes/ClassModal';

export interface IClass {
  _id: string;
  title: string;
  description?: string;
  trainer: { _id: string; name: string };
  schedule: string;
  createdAt: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<IClass | null>(null);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/classes');
      setClasses(data);
    } catch (error) {
      toast.error('Failed to fetch classes.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleModalOpen = (classItem: IClass | null = null) => {
    setClassToEdit(classItem);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setClassToEdit(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Classes</h1>
        <button
          onClick={() => handleModalOpen()}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          New Class
        </button>
      </div>

      {isLoading ? (
        <p>Loading classes...</p>
      ) : (
        <ClassTable
          classes={classes}
          onEdit={handleModalOpen}
          onUpdate={fetchClasses}
        />
      )}

      <ClassModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={fetchClasses}
        classToEdit={classToEdit}
      />
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { TaskModal } from '@/components/tasks/TaskModal';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function ContestsPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/tasks');
      setTasks(data.filter((t: any) => t.type === 'contest'));
    } catch (error) {
      toast.error('Could not load contest tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreatedOrUpdated = () => {
    fetchTasks();
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <div>Loading contests...</div>;

  return (
    <div className="space-y-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Contests</h1>
        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          New Contest
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'].map(
          (status) => (
            <div
              key={status}
              className="bg-gray-200 rounded-lg p-3 flex flex-col h-full"
            >
              <h3 className="font-semibold text-lg mb-4 flex items-center sticky top-0 bg-gray-200 py-2">
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${
                    status === 'TODO'
                      ? 'bg-gray-500'
                      : status === 'IN_PROGRESS'
                        ? 'bg-blue-500'
                        : status === 'IN_REVIEW'
                          ? 'bg-purple-500'
                          : status === 'COMPLETED'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                  }`}
                ></span>
                {status.replace('_', ' ')}
                <span className="ml-2 text-gray-500 text-sm font-normal">
                  {tasks.filter((t) => t.status === status).length}
                </span>
              </h3>
              <div className="space-y-3 overflow-y-auto flex-1">
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <div
                      key={task._id}
                      className="bg-white rounded-md p-4 shadow-sm cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
                      onClick={() => {
                        setTaskToEdit(task);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-800">
                          {task.title}
                        </h4>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            task.priority === 'HIGH'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'LOW'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {task.courseName && (
                          <span>Course: {task.courseName} </span>
                        )}
                        {task.batchNo && <span>Batch: {task.batchNo} </span>}
                        {task.contestName && (
                          <span>Contest: {task.contestName}</span>
                        )}
                      </div>
                      <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                        <span>
                          Due:{' '}
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : 'N/A'}
                        </span>
                        {task.assignedTo && (
                          <span>Assigned: {task.assignedTo.name}</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ),
        )}
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setTaskToEdit(null);
          setIsModalOpen(false);
        }}
        onTaskCreated={handleTaskCreatedOrUpdated}
        taskToEdit={taskToEdit}
        // Always set type to 'contest' on creation
        key={taskToEdit ? taskToEdit._id : 'new'}
      />
    </div>
  );
}

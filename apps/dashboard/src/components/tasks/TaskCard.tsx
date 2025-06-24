import { useState } from 'react';
import { ITask } from "./TaskBoard";
import { TaskModal } from './TaskModal';
import { ClockIcon, UserCircleIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

type TaskCardProps = {
    task: ITask;
    onTaskUpdate: () => void;
}

const priorityClasses: Record<ITask['priority'], string> = {
    LOW: 'bg-green-100 text-green-800',
    NORMAL: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
};

export function TaskCard({ task, onTaskUpdate }: TaskCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="bg-white rounded-md p-4 shadow-sm cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
            >
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800">{task.title}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${priorityClasses[task.priority]}`}>
                        {task.priority}
                    </span>
                </div>
                {task.description && (
                    <p className="text-sm text-gray-600 mt-2 flex items-start gap-2">
                        <Bars3BottomLeftIcon className='h-4 w-4 mt-1 flex-shrink-0' />
                        {task.description.substring(0, 100)}{task.description.length > 100 ? '...' : ''}
                    </p>
                )}
                <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                    </div>
                    {task.assignedTo && (
                        <div className="flex items-center gap-1">
                            <UserCircleIcon className="h-4 w-4" />
                            <span>{task.assignedTo.name}</span>
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && (
                 <TaskModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onTaskCreated={onTaskUpdate}
                    taskToEdit={task}
                />
            )}
        </>
    );
}
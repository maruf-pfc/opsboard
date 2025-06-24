import { ITask } from "./TaskBoard"; // Import the type from TaskBoard
import { TaskCard } from "./TaskCard";

type TaskColumnProps = {
    status: ITask['status'];
    tasks: ITask[];
    onTaskUpdate: () => void;
}

const statusMap: Record<ITask['status'], { name: string, color: string }> = {
    TODO: { name: 'To Do', color: 'bg-gray-500' },
    IN_PROGRESS: { name: 'In Progress', color: 'bg-blue-500' },
    IN_REVIEW: { name: 'In Review', color: 'bg-purple-500' },
    COMPLETED: { name: 'Completed', color: 'bg-green-500' },
    BLOCKED: { name: 'Blocked', color: 'bg-red-500' },
};

export function TaskColumn({ status, tasks, onTaskUpdate }: TaskColumnProps) {
    const { name, color } = statusMap[status];

    return (
        <div className="bg-gray-200 rounded-lg p-3 flex flex-col h-full">
            <h3 className="font-semibold text-lg mb-4 flex items-center sticky top-0 bg-gray-200 py-2">
                <span className={`w-3 h-3 rounded-full mr-2 ${color}`}></span>
                {name}
                <span className="ml-2 text-gray-500 text-sm font-normal">{tasks.length}</span>
            </h3>
            <div className="space-y-3 overflow-y-auto flex-1">
                {tasks.map(task => (
                    <TaskCard key={task._id} task={task} onTaskUpdate={onTaskUpdate} />
                ))}
            </div>
        </div>
    );
}
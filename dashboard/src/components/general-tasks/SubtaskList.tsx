import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { ITask } from "./TaskBoard";
import { PlusIcon } from "@heroicons/react/24/solid";

type SubtaskListProps = {
  parentTaskId: string;
  subtasks: ITask[];
  onUpdate: () => void;
};

export function SubtaskList({
  parentTaskId,
  subtasks,
  onUpdate,
}: SubtaskListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    try {
      await api.post("/tasks", {
        title: newSubtaskTitle,
        parentTask: parentTaskId,
      });
      toast.success("Subtask added!");
      setNewSubtaskTitle("");
      onUpdate();
    } catch (error) {
      toast.error("Failed to add subtask.");
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-md font-semibold text-gray-800">Subtasks</h4>
      <ul className="mt-2 space-y-2">
        {subtasks.map((subtask) => (
          <li key={subtask._id} className="text-sm p-2 bg-gray-100 rounded-md">
            {subtask.title}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddSubtask} className="mt-2 flex gap-2">
        <input
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          placeholder="Add a new subtask..."
          className="flex-grow block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
        />
        <button
          type="submit"
          className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

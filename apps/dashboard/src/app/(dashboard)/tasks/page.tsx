'use client';

import { TaskBoard } from '@/components/tasks/TaskBoard';

// Note: All complex state logic (fetching tasks, opening modals, etc.)
// is encapsulated within the TaskBoard component itself. This keeps the page
// component clean and focused on layout.
export default function TasksPage() {
  return (
    <div className="space-y-8 px-2 sm:px-4 md:px-6 lg:px-8">
      {/* 
        The TaskBoard component handles everything:
        - Fetching all tasks from the API.
        - Managing its own state (tasks, isLoading).
        - Rendering columns and task cards.
        - Handling the "New Task" button and opening the TaskModal.
      */}
      <TaskBoard />
    </div>
  );
}

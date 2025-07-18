import { ReactNode } from 'react';

interface KanbanCardProps {
  title: string;
  description?: string;
  details?: ReactNode[];
  metaTop: ReactNode[];
  metaBottom: ReactNode[];
  priority: 'NORMAL' | 'MEDIUM' | 'HIGH';
  onClick: () => void;
  children?: ReactNode;
}

const priorityBg: Record<'NORMAL' | 'MEDIUM' | 'HIGH', string> = {
  HIGH: 'bg-red-100',
  MEDIUM: 'bg-yellow-100',
  NORMAL: 'bg-gray-100',
};

export default function KanbanCard({
  title,
  description,
  details = [],
  metaTop = [],
  metaBottom = [],
  priority,
  onClick,
  children,
}: KanbanCardProps) {
  return (
    <div
      className={`w-full ${priorityBg[priority]} backdrop-blur-sm border border-gray-100 rounded-2xl shadow-xl p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-2xl hover:scale-[1.02] focus-within:ring-2 focus-within:ring-indigo-400 focus-within:ring-offset-2 group relative cursor-pointer`}
      onClick={onClick}
      tabIndex={0}
      role="button"
    >
      {/* Title */}
      <div className="task-title text-lg font-extrabold text-gray-900 break-words whitespace-pre-line">
        {title}
      </div>
      {/* Description */}
      {description && (
        <p className="text-sm text-gray-700 mt-1 break-words whitespace-pre-line">
          {description}
        </p>
      )}
      {/* Details Section: All extra fields */}
      {details.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700 mt-1 w-full break-words items-center">
          {details.map((item, idx) => (
            <span key={idx}>{item}</span>
          ))}
        </div>
      )}
      {/* Meta Top Row: Start, Due */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1 w-full break-words items-center">
        {metaTop.map((item, idx) => (
          <span key={idx}>{item}</span>
        ))}
      </div>
      {/* Meta Bottom Row: Assigned, Reported (with images) */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700 mt-1 w-full break-words items-center">
        {metaBottom.map((item, idx) => (
          <span key={idx}>{item}</span>
        ))}
      </div>
      {children}
    </div>
  );
}

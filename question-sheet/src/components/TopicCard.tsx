import CollapseArrow from "./CollapseArrow";

interface TopicCardProps {
  title: string;
  completedCount: number;
  totalCount: number;
  isCollapsed?: boolean;
  onToggle?: () => void;
  onAddSubtopic?: () => void;
  children?: React.ReactNode;
}

export default function TopicCard({ title, completedCount, totalCount, isCollapsed = false, onToggle, onAddSubtopic, children }: TopicCardProps) {
  return (
    <div className="bg-[#16213e] rounded-xl overflow-hidden border border-[#1f3056] shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* header */}
      <div className="flex items-center justify-between px-5 py-4 hover:bg-[#1a2745] transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <CollapseArrow isCollapsed={!!isCollapsed} onToggle={onToggle ?? (() => {})} />
          <h2 className="text-white font-semibold text-lg">{title}</h2>
        </div>
        <span className="text-xs text-gray-400 bg-[#0f0f0f] px-3 py-1 rounded-full">
          {completedCount} / {totalCount} completed
        </span>
      </div>

      <div className="px-5 pb-5 space-y-4 transition-all duration-150 ease-in-out">
        {!isCollapsed && children}

        {/* Add Subtopic action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onAddSubtopic}
            className="text-sm text-pink-400 hover:text-pink-300"
          >
            Add Subtopic
          </button>
        </div>
      </div>
    </div>
  );
}
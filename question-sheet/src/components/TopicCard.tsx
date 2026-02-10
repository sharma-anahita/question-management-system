import { useState } from "react";
import CollapseArrow from "./CollapseArrow";

interface TopicCardProps {
  title: string;
  completedCount: number;
  totalCount: number;
  isCollapsed?: boolean;
  onToggle?: () => void;
  onAddSubtopic?: () => void;
  onDelete?: () => void;
  onRename?: (newTitle: string) => void;
  children?: React.ReactNode;
}

export default function TopicCard({ title, completedCount, totalCount, isCollapsed = false, onToggle, onAddSubtopic, onDelete, onRename, children }: TopicCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== title && onRename) onRename(trimmed);
    setEditing(false);
  };

  return (
    <div className="bg-[#16213e] rounded-xl overflow-hidden border border-[#1f3056] shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* header */}
      <div className="flex items-center justify-between px-5 py-4 hover:bg-[#1a2745] transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <CollapseArrow isCollapsed={!!isCollapsed} onToggle={onToggle ?? (() => {})} />
          {editing ? (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setDraft(title); setEditing(false); } }}
              onBlur={save}
              autoFocus
              className="bg-[#0f0f0f] text-white font-semibold text-lg px-2 py-0.5 rounded outline-none"
            />
          ) : (
            <>
              <h2 className="text-white font-semibold text-lg">{title}</h2>
              {onRename && (
                <button type="button" className="text-xs text-gray-500 hover:text-gray-300 transition-colors" onClick={(e) => { e.stopPropagation(); setDraft(title); setEditing(true); }}>✏️</button>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-[#0f0f0f] px-3 py-1 rounded-full">
            {completedCount} / {totalCount} completed
          </span>
          {onDelete && (
            <button type="button" className="text-xs text-gray-500 hover:text-red-400 transition-colors" onClick={(e) => { e.stopPropagation(); onDelete(); }}>❌</button>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 space-y-4 transition-all duration-150 ease-in-out">
        {!isCollapsed && totalCount === 0 && (
          <p className="text-xs text-gray-500">No subtopics yet. Add one to get started.</p>
        )}
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
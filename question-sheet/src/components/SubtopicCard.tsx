import { useState } from "react";
import CollapseArrow from "./CollapseArrow";

interface SubtopicCardProps {
  title: string;
  completedCount: number;
  totalCount: number;
  isCollapsed?: boolean;
  onToggle?: () => void;
  onAddQuestion?: () => void;
  onDelete?: () => void;
  onRename?: (newTitle: string) => void;
  children?: React.ReactNode;
}

export default function SubtopicCard({ title, completedCount, totalCount, isCollapsed = false, onToggle, onAddQuestion, onDelete, onRename, children }: SubtopicCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== title && onRename) onRename(trimmed);
    setEditing(false);
  };

  return (
    <div className="bg-[#1a1a2e] rounded-lg border border-[#2a2a4a] overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* subtopic header */}
      <div className="flex items-center justify-between px-4 py-3 hover:bg-[#1e1e38] transition-colors cursor-pointer">
        <div className="flex items-center gap-2">
          <CollapseArrow isCollapsed={!!isCollapsed} onToggle={onToggle ?? (() => {})} />
          {editing ? (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setDraft(title); setEditing(false); } }}
              onBlur={save}
              autoFocus
              className="bg-[#0f0f0f] text-gray-200 font-medium text-sm px-2 py-0.5 rounded outline-none"
            />
          ) : (
            <>
              <h3 className="text-gray-200 font-medium text-sm">{title}</h3>
              {onRename && (
                <button type="button" className="text-xs text-gray-500 hover:text-gray-300 transition-colors" onClick={(e) => { e.stopPropagation(); setDraft(title); setEditing(true); }}>✏️</button>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{completedCount} / {totalCount}</span>
          {onDelete && (
            <button type="button" className="text-xs text-gray-500 hover:text-red-400 transition-colors" onClick={(e) => { e.stopPropagation(); onDelete(); }}>❌</button>
          )}
        </div>
      </div>

      <div className="px-4 pb-3 space-y-2 transition-all duration-150 ease-in-out">
        {!isCollapsed && totalCount === 0 && (
          <p className="text-xs text-gray-500">No questions yet.</p>
        )}
        {!isCollapsed && children}
        {!isCollapsed && onAddQuestion && (
          <button type="button" className="text-xs text-pink-400 hover:text-pink-300 mt-1" onClick={onAddQuestion}>Add Question</button>
        )}
      </div>
    </div>
  );
}
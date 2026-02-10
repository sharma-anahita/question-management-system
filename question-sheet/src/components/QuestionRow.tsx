import { useState } from "react";

interface QuestionRowProps {
  title: string;
  difficulty: string;
  link: string;
  completed: boolean;
  onToggleComplete: () => void;
  onDelete?: () => void;
  onRename?: (newTitle: string) => void;
}

export default function QuestionRow({ title, difficulty, link, completed, onToggleComplete, onDelete, onRename }: QuestionRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== title && onRename) onRename(trimmed);
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-between bg-[#0f0f0f] rounded-lg px-4 py-3 hover:bg-[#141422] transition-colors group">
      {/* left side */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggleComplete}
          className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
        />
        {editing ? (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setDraft(title); setEditing(false); } }}
            onBlur={save}
            autoFocus
            className="bg-[#1a1a2e] text-gray-300 text-sm px-2 py-0.5 rounded outline-none"
          />
        ) : (
          <>
            <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
              {title}
            </span>
            {onRename && (
              <button type="button" className="text-xs text-gray-500 hover:text-gray-300 transition-colors" onClick={(e) => { e.stopPropagation(); setDraft(title); setEditing(true); }}>✏️</button>
            )}
          </>
        )}
      </div>

      {/* right side */}
      <div className="flex items-center gap-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-400 border border-green-800/50">
          {difficulty}
        </span>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400 hover:text-pink-300 text-xs font-medium transition-colors"
        >
          LeetCode ↗
        </a>
        {onDelete && (
          <button type="button" className="text-xs text-gray-500 hover:text-red-400 transition-colors" onClick={(e) => { e.stopPropagation(); onDelete(); }}>❌</button>
        )}
      </div>
    </div>
  );
}
interface QuestionRowProps {
  title: string;
  difficulty: string;
  link: string;
  completed: boolean;
  onToggleComplete: () => void;
  onDelete?: () => void;
}

export default function QuestionRow({ title, difficulty, link, completed, onToggleComplete, onDelete }: QuestionRowProps) {
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
        <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
          {title}
        </span>
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
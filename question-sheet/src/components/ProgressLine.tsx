interface ProgressLineProps {
  completedCount: number;
  totalCount: number;
}

export default function ProgressLine({ completedCount, totalCount }: ProgressLineProps) {
  const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-[#0f0f0f] rounded-full overflow-hidden">
        <div
          className="h-full bg-pink-500 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">
        {completedCount} / {totalCount} completed
      </span>
    </div>
  );
}
interface CollapseArrowProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function CollapseArrow({ isCollapsed, onToggle }: CollapseArrowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-pink-400 text-lg cursor-pointer hover:text-pink-300 transition-colors transition-all duration-150"
      aria-pressed={isCollapsed}
      aria-label={isCollapsed ? "Expand" : "Collapse"}
    >
      {isCollapsed ? "▶" : "▼"}
    </button>
  );
}
export default function SheetLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-[#1a1a2e] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-1">
          DSA Question Sheet
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Track your progress across all topics
        </p>

        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
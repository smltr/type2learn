'use client';

export function HistorySidebar() {
  return (
    <div className="w-52 bg-[#252526] border-r border-[#1e1e1e] flex flex-col">
      <div className="h-9 flex items-center px-3 text-xs text-[#cccccc] uppercase tracking-wide">Explorer</div>
      <div className="flex-1 overflow-auto text-xs">
        <div className="px-2 py-1">
          <div className="ml-2 space-y-0.5">
            <div className="py-0.5 px-1 -ml-1 bg-[#37373d] text-white">practice.md</div>
          </div>
        </div>
      </div>
    </div>
  );
}

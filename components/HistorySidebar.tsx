'use client';

import { ReactIcon } from '@/components/ReactIcon';
import type { CodeSnippet } from '@/lib/snippets';

interface HistorySidebarProps {
  snippets: CodeSnippet[];
  currentIndex: number;
  isViewingHistory: boolean;
  selectedFileIndex: number | null;
  getFileName: (snippet: CodeSnippet) => string;
  onFileClick: (index: number) => void;
}

export function HistorySidebar({
  snippets,
  currentIndex,
  isViewingHistory,
  selectedFileIndex,
  getFileName,
  onFileClick,
}: HistorySidebarProps) {
  return (
    <div className="w-52 bg-[#252526] border-r border-[#1e1e1e] flex flex-col">
      <div className="h-9 flex items-center px-3 text-xs text-[#cccccc] uppercase tracking-wide">History</div>
      <div className="flex-1 overflow-auto text-xs">
        <div className="px-2 py-1">
          <div className="ml-2 space-y-0.5">
            {snippets.slice(0, currentIndex + 1).map((snippet, index) => {
              const isActive = !isViewingHistory && index === currentIndex;
              const isSelected = isViewingHistory && selectedFileIndex === index;
              const fileName = getFileName(snippet);

              return (
                <div
                  key={snippet.id}
                  className={`py-0.5 px-1 -ml-1 cursor-pointer hover:bg-[#2a2d2e] ${
                    isActive || isSelected ? 'bg-[#37373d] text-white' : 'text-[#cccccc]'
                  }`}
                  onClick={() => onFileClick(index)}
                >
                  <span className="mr-2 inline-flex align-middle">
                    <ReactIcon size={14} />
                  </span>
                  {fileName}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

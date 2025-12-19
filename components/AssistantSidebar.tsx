'use client';

import { CodeDisplay } from '@/components/CodeDisplay';
import type { CodeSnippet } from '@/lib/snippets';

interface AssistantSidebarProps {
  displaySnippet: CodeSnippet | null;
  isViewingHistory: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onGenerateSnippet: (input: { language: string; topic: string }) => Promise<void> | void;
  isGenerating: boolean;
  generateError: string | null;
  isCoolingDown: boolean;
}

export function AssistantSidebar({
  displaySnippet,
  isViewingHistory,
  isAtStart,
  isAtEnd,
  onPrevious,
  onNext,
  onGenerateSnippet,
  isGenerating,
  generateError,
  isCoolingDown,
}: AssistantSidebarProps) {
  return (
    <div className="w-[420px] bg-[#252526] border-l border-[#1e1e1e] flex flex-col">
      <div className="flex-1 overflow-auto">
        {displaySnippet && (
          <CodeDisplay
            code={displaySnippet.code}
            language={displaySnippet.language}
            title={displaySnippet.title}
            onGenerateSnippet={onGenerateSnippet}
            isGenerating={isGenerating}
            generateError={generateError}
            isCoolingDown={isCoolingDown}
          />
        )}
      </div>

      {!isViewingHistory && (
        <div className="p-2 border-t border-[#1e1e1e] flex gap-2">
          <button
            onClick={onPrevious}
            disabled={isAtStart}
            className="flex-1 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            disabled={isAtEnd}
            className="flex-1 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { CodeDisplay } from '@/components/CodeDisplay';
import type { CodeSnippet } from '@/lib/snippets';

interface AssistantSidebarProps {
  displaySnippet: CodeSnippet | null;
  onGenerateSnippet: (input: { language: string; topic: string }) => Promise<void> | void;
  isGenerating: boolean;
  generateError: string | null;
  isCoolingDown: boolean;
}

export function AssistantSidebar({
  displaySnippet,
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
    </div>
  );
}

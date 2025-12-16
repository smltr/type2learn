'use client';

import { useState } from 'react';
import { CodeDisplay } from '@/components/CodeDisplay';
import { CodeTyping } from '@/components/CodeTyping';
import { codeSnippets } from '@/lib/snippets';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSnippets, setCompletedSnippets] = useState<Set<string>>(new Set());

  const currentSnippet = codeSnippets[currentIndex];

  const handleComplete = () => {
    setCompletedSnippets(prev => new Set(prev).add(currentSnippet.id));
  };

  const nextSnippet = () => {
    if (currentIndex < codeSnippets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousSnippet = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
      {/* Top bar - VS Code style */}
      <div className="h-9 bg-[#323233] border-b border-[#1e1e1e] flex items-center px-2 text-xs">
        <span className="text-[#cccccc]">Type2Learn</span>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - File Explorer */}
        <div className="w-52 bg-[#252526] border-r border-[#1e1e1e] flex flex-col">
          <div className="h-9 flex items-center px-3 text-xs text-[#cccccc] uppercase tracking-wide">
            Explorer
          </div>
          <div className="flex-1 overflow-auto text-xs">
            <div className="px-2 py-1">
              <div className="text-[#cccccc] font-semibold mb-1 text-xs">TYPE2LEARN</div>
              <div className="ml-2 space-y-0.5">
                <div className="text-[#6a6a6a] py-0.5">📄 README.md</div>
                <div className="text-[#6a6a6a] py-0.5">📄 package.json</div>
                <div className="text-[#6a6a6a] py-0.5">📁 app</div>
                <div className="text-[#6a6a6a] py-0.5">📁 components</div>
                <div className="text-[#6a6a6a] py-0.5">📁 lib</div>
                <div className="bg-[#37373d] text-white py-0.5 px-1 -ml-1">
                  📄 practice.tsx
                </div>
                <div className="text-[#6a6a6a] py-0.5">📁 public</div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Editor + Terminal */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab bar */}
          <div className="h-9 bg-[#252526] border-b border-[#1e1e1e] flex items-center">
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-[#cccccc] border-r border-[#1e1e1e] flex items-center gap-2">
              <span>practice.tsx</span>
            </div>
          </div>

          {/* Editor area */}
          <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
            <CodeTyping
              targetCode={currentSnippet.code}
              language={currentSnippet.language}
              onComplete={handleComplete}
            />
          </div>

          {/* Terminal panel */}
          <div className="h-40 bg-[#1e1e1e] border-t border-[#252526] flex flex-col">
            <div className="h-9 bg-[#252526] flex items-center px-3 text-xs text-[#cccccc] gap-4">
              <span className="text-white border-b border-white pb-1">ABOUT</span>
            </div>
            <div className="flex-1 overflow-auto p-3 font-mono text-xs text-[#cccccc]">
              <div className="text-green-400">$ Made by Sam</div>
              <div className="mt-1">github.com/smltr/type2learn</div>
            </div>
          </div>
        </div>

        {/* Right sidebar - Chat/AI */}
        <div className="w-96 bg-[#252526] border-l border-[#1e1e1e] flex flex-col">
          <div className="h-9 flex items-center px-3 text-xs text-[#cccccc] border-b border-[#1e1e1e]">
            <span>Assistant</span>
          </div>
          <div className="flex-1 overflow-auto">
            <CodeDisplay
              code={currentSnippet.code}
              language={currentSnippet.language}
              title={currentSnippet.title}
            />
          </div>
          {/* Navigation controls in chat panel */}
          <div className="p-2 border-t border-[#1e1e1e] flex gap-2">
            <button
              onClick={previousSnippet}
              disabled={currentIndex === 0}
              className="flex-1 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={nextSnippet}
              disabled={currentIndex === codeSnippets.length - 1}
              className="flex-1 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

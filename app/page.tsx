'use client';

import { useState } from 'react';
import { CodeDisplay } from '@/components/CodeDisplay';
import { CodeTyping } from '@/components/CodeTyping';
import { ReactIcon } from '@/components/ReactIcon';
import { codeSnippets, type CodeSnippet } from '@/lib/snippets';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCode, setUserCode] = useState<Record<string, string>>({});
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);

  const currentSnippet = codeSnippets[currentIndex];
  const isViewingHistory = selectedFileIndex !== null;
  const selectedSnippet = isViewingHistory && selectedFileIndex !== null ? codeSnippets[selectedFileIndex] : null;
  const currentCode = userCode[currentSnippet.id] || '';
  const displaySnippet = isViewingHistory && selectedSnippet ? selectedSnippet : currentSnippet;

  const getFileName = (snippet: CodeSnippet) =>
    `${snippet.title.toLowerCase().replace(/\s+/g, '-')}.${snippet.language === 'typescript' ? 'tsx' : 'jsx'}`;

  const handleCodeChange = (snippetId: string, code: string) => {
    setUserCode(prev => ({ ...prev, [snippetId]: code }));
  };

  const handleComplete = (code: string) => {
    setUserCode(prev => ({ ...prev, [currentSnippet.id]: code }));
  };

  const nextSnippet = (currentCode: string) => {
    if (currentIndex < codeSnippets.length - 1) {
      // Save current code if not empty
      if (currentCode.trim()) {
        const snippetId = currentSnippet.id;
        setUserCode(prev => ({ ...prev, [snippetId]: currentCode }));
      }
      setCurrentIndex(currentIndex + 1);
      setSelectedFileIndex(null);
    }
  };

  const previousSnippet = (currentCode: string) => {
    if (currentIndex > 0) {
      // Save current code if not empty
      if (currentCode.trim()) {
        const snippetId = currentSnippet.id;
        setUserCode(prev => ({ ...prev, [snippetId]: currentCode }));
      }
      setCurrentIndex(currentIndex - 1);
      setSelectedFileIndex(null);
    }
  };

  const handleFileClick = (index: number) => {
    setSelectedFileIndex(index);
  };

  const backToCurrentPractice = () => {
    setSelectedFileIndex(null);
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
      {/* Top bar - VS Code style */}
      <div className="h-9 bg-[#323233] border-b border-[#1e1e1e] flex items-center px-2 text-xs">
        <span className="text-[#cccccc]">Type2Learn</span>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - History */}
        <div className="w-52 bg-[#252526] border-r border-[#1e1e1e] flex flex-col">
          <div className="h-9 flex items-center px-3 text-xs text-[#cccccc] uppercase tracking-wide">
            History
          </div>
          <div className="flex-1 overflow-auto text-xs">
            <div className="px-2 py-1">
              <div className="ml-2 space-y-0.5">
                {/* Show files for current snippet + all completed snippets */}
                {codeSnippets.slice(0, currentIndex + 1).map((snippet, index) => {
                  const isActive = !isViewingHistory && index === currentIndex;
                  const isSelected = isViewingHistory && selectedFileIndex === index;
                  const fileName = getFileName(snippet);

                  return (
                    <div
                      key={snippet.id}
                      className={`py-0.5 px-1 -ml-1 cursor-pointer hover:bg-[#2a2d2e] ${
                        isActive || isSelected ? 'bg-[#37373d] text-white' : 'text-[#cccccc]'
                      }`}
                      onClick={() => handleFileClick(index)}
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

        {/* Center - Editor + Terminal */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab bar */}
          <div className="h-9 bg-[#252526] border-b border-[#1e1e1e] flex items-center">
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-[#cccccc] border-r border-[#1e1e1e] flex items-center gap-2">
              <span>{isViewingHistory && selectedSnippet ? getFileName(selectedSnippet) : getFileName(currentSnippet)}</span>
            </div>
          </div>

          {/* Editor area */}
          <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
            {isViewingHistory ? (
              (() => {
                const historySnippet = selectedSnippet!;
                return (
              <div className="w-full h-full flex flex-col">
                <div className="flex-1 overflow-auto">
                  <CodeTyping
                    key={`history-${selectedFileIndex}`}
                    targetCode={historySnippet.code}
                    language={historySnippet.language}
                    onComplete={handleComplete}
                    initialCode={userCode[historySnippet.id] || ''}
                    readOnly={true}
                  />
                </div>
                <div className="p-2 bg-[#252526] border-t border-[#1e1e1e]">
                  <button
                    onClick={backToCurrentPractice}
                    className="px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs rounded"
                  >
                    ← Back to Current Practice
                  </button>
                </div>
                </div>
                );
              })()
            ) : (
              <CodeTyping
                key={`practice-${currentIndex}`}
                targetCode={currentSnippet.code}
                language={currentSnippet.language}
                onComplete={handleComplete}
                initialCode={userCode[currentSnippet.id] || ''}
                readOnly={false}
                onChange={value => handleCodeChange(currentSnippet.id, value)}
              />
            )}
          </div>

          {/* Terminal panel */}
          <div className="h-40 bg-[#1e1e1e] border-t border-[#252526] flex flex-col">
            <div className="h-9 bg-[#252526] flex items-center px-3 text-xs text-[#cccccc] gap-4">
              <span className="text-white border-b border-white pb-1">ABOUT</span>
            </div>
            <div className="flex-1 overflow-auto p-3 font-mono text-xs text-[#cccccc]">
              <span className="text-[#cccccc]">$ Made by <a href="https://github.com/smltr" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Sam</a></span>
              <div className="mt-1"><a href="https://github.com/smltr/type2learn" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">github.com/smltr/type2learn</a></div>
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
              code={displaySnippet.code}
              language={displaySnippet.language}
              title={displaySnippet.title}
            />
          </div>
          {/* Navigation controls in chat panel */}
          {!isViewingHistory && (
            <div className="p-2 border-t border-[#1e1e1e] flex gap-2">
              <button
                onClick={() => previousSnippet(currentCode)}
                disabled={currentIndex === 0}
                className="flex-1 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs rounded disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <button
                onClick={() => nextSnippet(currentCode)}
                disabled={currentIndex === codeSnippets.length - 1}
                className="flex-1 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs rounded disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

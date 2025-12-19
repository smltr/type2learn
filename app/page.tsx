'use client';

import { useEffect, useRef, useState } from 'react';
import { CodeTyping } from '@/components/CodeTyping';
import { AssistantSidebar } from '@/components/AssistantSidebar';
import { HistorySidebar } from '@/components/HistorySidebar';
import { codeSnippets, type CodeSnippet } from '@/lib/snippets';

export default function Home() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>(codeSnippets);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCode, setUserCode] = useState<Record<string, string>>({});
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSnippet = snippets[currentIndex];
  const isViewingHistory = selectedFileIndex !== null;
  const selectedSnippet = isViewingHistory && selectedFileIndex !== null ? snippets[selectedFileIndex] : null;
  const currentCode = currentSnippet ? userCode[currentSnippet.id] || '' : '';
  const displaySnippet = isViewingHistory && selectedSnippet ? selectedSnippet : currentSnippet;

  const getFileName = (snippet: CodeSnippet) =>
    `${snippet.title.toLowerCase().replace(/\s+/g, '-')}.${snippet.language === 'typescript' ? 'tsx' : 'jsx'}`;

  const handleCodeChange = (snippetId: string, code: string) => {
    setUserCode(prev => ({ ...prev, [snippetId]: code }));
  };

  const handleComplete = (code: string) => {
    if (!currentSnippet) return;
    setUserCode(prev => ({ ...prev, [currentSnippet.id]: code }));
  };

  const nextSnippet = () => {
    if (currentIndex < snippets.length - 1 && currentSnippet) {
      // Save current code if not empty
      if (currentCode.trim() && currentSnippet) {
        const snippetId = currentSnippet.id;
        setUserCode(prev => ({ ...prev, [snippetId]: currentCode }));
      }
      setCurrentIndex(currentIndex + 1);
      setSelectedFileIndex(null);
    }
  };

  const previousSnippet = () => {
    if (currentIndex > 0 && currentSnippet) {
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

  const handleGenerateSnippet = async ({ language, topic }: { language: string; topic: string }) => {
    if (isGenerating || isCoolingDown) return;
    setGenerateError(null);
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, topic }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = typeof data.error === 'string' ? data.error : 'Failed to generate snippet.';
        throw new Error(message);
      }

      const code = typeof data.code === 'string' ? data.code.trim() : '';
      if (!code) {
        throw new Error('Model returned empty code. Try another topic.');
      }

      const newSnippet: CodeSnippet = {
        id: `gemini-${Date.now()}`,
        title: `Gemini: ${topic}`,
        language,
        difficulty: 'medium',
        code,
      };

      setSnippets(prev => {
        const next = [...prev, newSnippet];
        setCurrentIndex(next.length - 1);
        setSelectedFileIndex(null);
        return next;
      });
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : 'Failed to generate snippet.');
    } finally {
      setIsGenerating(false);
      setIsCoolingDown(true);
      if (cooldownTimer.current) {
        clearTimeout(cooldownTimer.current);
      }
      cooldownTimer.current = setTimeout(() => {
        setIsCoolingDown(false);
      }, 4000);
    }
  };

  useEffect(() => {
    return () => {
      if (cooldownTimer.current) {
        clearTimeout(cooldownTimer.current);
      }
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
      {/* Top bar - VS Code style */}
      <div className="h-9 bg-[#323233] border-b border-[#1e1e1e] flex items-center px-2 text-xs">
        <span className="text-[#cccccc]">Type2Learn</span>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        <HistorySidebar
          snippets={snippets}
          currentIndex={currentIndex}
          isViewingHistory={isViewingHistory}
          selectedFileIndex={selectedFileIndex}
          getFileName={getFileName}
          onFileClick={handleFileClick}
        />

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
              currentSnippet && (
                <CodeTyping
                  key={`practice-${currentIndex}`}
                  targetCode={currentSnippet.code}
                  language={currentSnippet.language}
                  onComplete={handleComplete}
                  initialCode={userCode[currentSnippet.id] || ''}
                  readOnly={false}
                  onChange={value => handleCodeChange(currentSnippet.id, value)}
                />
              )
            )}
          </div>

          {/* Terminal panel */}
          <div className="h-40 bg-[#1e1e1e] border-t border-[#252526] flex flex-col">
            <div className="h-9 bg-[#252526] flex items-center px-3 text-xs text-[#cccccc] gap-4">
              <span className="text-white border-b border-white pb-1">ABOUT</span>
            </div>
            <div className="flex-1 overflow-auto p-3 font-mono text-xs text-[#cccccc]">
              <span className="text-[#cccccc]">$ Made by <a href="https://github.com/smltr" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Sam</a></span>
              <div className="text-[#cccccc]"><a href="https://github.com/smltr/type2learn" target="_blank" rel="noopener noreferrer" className="hover:underline">github.com/smltr/type2learn</a></div>
            </div>
          </div>
        </div>

        <AssistantSidebar
          displaySnippet={displaySnippet}
          isViewingHistory={isViewingHistory}
          isAtStart={currentIndex === 0}
          isAtEnd={currentIndex === snippets.length - 1}
          onPrevious={previousSnippet}
          onNext={nextSnippet}
          onGenerateSnippet={handleGenerateSnippet}
          isGenerating={isGenerating}
          generateError={generateError}
          isCoolingDown={isCoolingDown}
        />
      </div>
    </div>
  );
}

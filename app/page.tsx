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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSnippet = snippets[currentIndex];

  const handleCodeChange = (snippetId: string, code: string) => {
    setUserCode(prev => ({ ...prev, [snippetId]: code }));
  };

  const handleComplete = (code: string) => {
    if (!currentSnippet) return;
    setUserCode(prev => ({ ...prev, [currentSnippet.id]: code }));
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
        <HistorySidebar />

        {/* Center - Editor + Terminal */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab bar */}
          <div className="h-9 bg-[#252526] border-b border-[#1e1e1e] flex items-center">
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-[#cccccc] border-r border-[#1e1e1e] flex items-center gap-2">
              <span>practice.md</span>
            </div>
          </div>

          {/* Editor area */}
          <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
            {currentSnippet && (
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
              <div className="text-[#cccccc]"><a href="https://github.com/smltr/type2learn" target="_blank" rel="noopener noreferrer" className="hover:underline">github.com/smltr/type2learn</a></div>
            </div>
          </div>
        </div>

        <AssistantSidebar
          displaySnippet={currentSnippet}
          onGenerateSnippet={handleGenerateSnippet}
          isGenerating={isGenerating}
          generateError={generateError}
          isCoolingDown={isCoolingDown}
        />
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeDisplayProps {
  code: string;
  language: string;
  title: string;
  onGenerateSnippet?: (input: { language: string; topic: string }) => Promise<void> | void;
  isGenerating?: boolean;
  generateError?: string | null;
  isCoolingDown?: boolean;
}

const languageOptions = ['typescript', 'javascript', 'python'];

export function CodeDisplay({
  code,
  language,
  title,
  onGenerateSnippet,
  isGenerating = false,
  generateError = null,
  isCoolingDown = false,
}: CodeDisplayProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('typescript');
  const [topicInput, setTopicInput] = useState('syntax');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const topic = topicInput.trim() || 'syntax';
    setLocalError(null);
    await onGenerateSnippet?.({ language: selectedLanguage, topic });
  };

  return (
    <div className="w-full h-full flex flex-col p-4 text-xs">
      {/* Chat message style */}
      <div className="mb-4">
        <div className="text-[#cccccc] text-xs mb-2">
          <p className="mb-2">This app helps you internalize TypeScript syntax by typing it. When typing code from memory instead of copy-pasting, you build the muscle memory and notice what you struggle to remember.</p>
          <p className="mb-3">Type the below code character for character for practice.</p>
          <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-3 space-y-3">
            <div className="text-[#cccccc] font-semibold text-[11px]">Generate a new snippet</div>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-[#a0a0a0] text-[11px] block">Language & Topic</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedLanguage}
                    onChange={event => setSelectedLanguage(event.target.value)}
                    className="w-full bg-[#2d2d30] border border-[#3e3e42] text-[#cccccc] rounded px-2 py-1.5 focus:outline-none"
                  >
                    {languageOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div>
                    <input
                      value={topicInput}
                      onChange={event => setTopicInput(event.target.value)}
                      placeholder="Type a topic or leave blank to auto-choose (syntax)"
                      className="w-full bg-[#2d2d30] border border-[#3e3e42] text-[#cccccc] rounded px-2 py-1.5 focus:outline-none placeholder:text-[#6f6f6f]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={!onGenerateSnippet || isGenerating || isCoolingDown}
                  className="w-full px-3 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? 'Generating…' : isCoolingDown ? 'Cooldown…' : 'Generate snippet'}
                </button>
                <span className="text-[#6f6f6f] text-[11px] leading-snug">
                  Uses Gemini with a short cooldown to prevent rapid calls.
                </span>
              </div>
              {(localError || generateError) && (
                <div className="text-red-400 text-[11px]">
                  {localError || generateError}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Code block in chat */}
      <div className="mb-4 bg-[#1e1e1e] rounded border border-[#3e3e42] overflow-hidden">
        <div className="bg-[#2d2d30] px-3 py-1 text-[#cccccc] text-xs font-mono border-b border-[#3e3e42] flex items-center justify-between">
          <span className="truncate">{title}</span>
          <span className="text-[#8f8f8f] ml-2">{language}</span>
        </div>
      <Highlight theme={themes.nightOwl} code={code} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <pre
              className={`${className} p-3 text-xs overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words`}
              style={{
                ...style,
                fontSize: '0.75rem',
                lineHeight: '1.4',
                backgroundColor: '#1e1e1e',
                maxHeight: '400px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowX: 'hidden',
                overflowY: 'auto',
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          );
        }}
      </Highlight>
      </div>
    </div>
  );
}

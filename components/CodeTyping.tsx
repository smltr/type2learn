'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeTypingProps {
  targetCode: string;
  language: string;
  onComplete: () => void;
}

export function CodeTyping({ targetCode, language, onComplete }: CodeTypingProps) {
  const [code, setCode] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    if (code === targetCode) {
      setIsComplete(true);
      if (!hasCalledComplete.current) {
        hasCalledComplete.current = true;
        onComplete();
      }
    } else {
      setIsComplete(false);
      hasCalledComplete.current = false;
    }
  }, [code, targetCode]);

  const doHighlight = (code: string) => {
    const lang = language === 'typescript' ? languages.typescript : languages.javascript;
    return highlight(code, lang, language);
  };

  // Add line numbers to code
  const codeLines = code.split('\n');
  const targetLines = targetCode.split('\n');

  return (
    <div className="w-full h-full flex">
      {/* Line numbers */}
      <div className="bg-[#1e1e1e] text-[#858585] text-right pr-4 pl-2 py-4 select-none font-mono text-sm leading-[1.5]" style={{ fontSize: '0.95rem' }}>
        {Array.from({ length: Math.max(codeLines.length, 1) }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      
      {/* Editor */}
      <div className={`flex-1 relative ${isComplete ? 'ring-2 ring-green-500 ring-inset' : ''}`}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={doHighlight}
          padding={16}
          tabSize={2}
          insertSpaces
          spellCheck={false}
          className="font-mono text-sm bg-[#1e1e1e] text-white h-full editor"
          style={{
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: '0.95rem',
            lineHeight: '1.5',
          }}
        />
        {isComplete && (
          <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold shadow-lg">
            ✓ Complete!
          </div>
        )}
      </div>
      <style jsx global>{`
        /* Ensure textarea and pre use the exact same metrics */
        .editor textarea, .editor pre {
          font-family: Menlo, Monaco, "Courier New", monospace !important;
          font-size: 0.95rem !important;
          line-height: 1.5 !important;
          white-space: pre !important;
          tab-size: 2;
        }
        .editor textarea {
          outline: none;
          background: transparent !important;
          color: #d4d4d4 !important;
        }
        .editor pre {
          background: transparent !important;
        }
      `}</style>
    </div>
  );
}

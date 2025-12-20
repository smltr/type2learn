'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeTypingProps {
  targetCode: string;
  language: string;
  onComplete: (code: string) => void;
  initialCode?: string;
  readOnly?: boolean;
  onChange?: (code: string) => void;
}

export function CodeTyping({ targetCode, language, onComplete, initialCode = '', readOnly = false, onChange }: CodeTypingProps) {
  const [code, setCode] = useState(initialCode);
  const hasCalledComplete = useRef(false);

  const isComplete = code === targetCode;

  useEffect(() => {
    if (!isComplete) {
      hasCalledComplete.current = false;
      return;
    }

    if (!hasCalledComplete.current && !readOnly) {
      hasCalledComplete.current = true;
      onComplete(code);
    }
  }, [isComplete, code, readOnly, onComplete]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;

    if (event.key === 'Enter') {
      event.preventDefault();

      const textarea = event.target as HTMLTextAreaElement;
      const { selectionStart, selectionEnd, value } = textarea;

      const before = value.slice(0, selectionStart);
      const after = value.slice(selectionEnd);

      const lineStart = before.lastIndexOf('\n') + 1;
      const currentLine = before.slice(lineStart);
      const indentMatch = currentLine.match(/^\s*/);
      const baseIndent = indentMatch ? indentMatch[0] : '';

      const trimmedBefore = before.trimEnd();
      const shouldIndentMore = trimmedBefore.endsWith('{');
      const indent = baseIndent + (shouldIndentMore ? '  ' : '');
      const insert = '\n' + indent;

      const newValue = before + insert + after;
      const newCursor = before.length + insert.length;

      setCode(newValue);
      onChange?.(newValue);

      requestAnimationFrame(() => {
        const target = event.target as HTMLTextAreaElement;
        target.setSelectionRange(newCursor, newCursor);
      });
    }
  };

  const doHighlight = (code: string) => {
    const lang = language === 'typescript' ? languages.typescript : languages.javascript;
    return highlight(code, lang, language);
  };

  // Add line numbers to code
  const codeLines = code.split('\n');

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
          onValueChange={value => {
            if (readOnly) return;
            setCode(value);
            onChange?.(value);
          }}
          highlight={doHighlight}
          padding={16}
          tabSize={2}
          insertSpaces
          spellCheck={false}
          onKeyDown={handleKeyDown}
          disabled={readOnly}
          className="font-mono text-sm bg-[#1e1e1e] text-white h-full editor"
          style={{
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            opacity: readOnly ? 0.7 : 1,
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

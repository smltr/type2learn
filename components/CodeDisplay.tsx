import { Highlight, themes } from 'prism-react-renderer';

interface CodeDisplayProps {
  code: string;
  language: string;
  title: string;
}

export function CodeDisplay({ code, language, title }: CodeDisplayProps) {
  return (
    <div className="w-full h-full flex flex-col p-4 text-xs">
      {/* Chat message style */}
      <div className="mb-4">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-[#0e639c] flex items-center justify-center text-xs flex-shrink-0">
            AI
          </div>
          <div className="flex-1">
            <div className="text-[#cccccc] text-xs mb-2">
              <p className="mb-2">This app helps you internalize TypeScript syntax by typing it. When typing code from memory instead of copy-pasting, you build the muscle memory and notice what you struggle to remember.</p>
              <p>Type the below code character for character for practice.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Code block in chat */}
      <div className="mb-4 bg-[#1e1e1e] rounded border border-[#3e3e42] overflow-hidden">
        <div className="bg-[#2d2d30] px-3 py-1 text-[#cccccc] text-xs font-mono border-b border-[#3e3e42]">
          {language}
        </div>
      <Highlight theme={themes.nightOwl} code={code} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <pre
              className={`${className} p-3 overflow-auto text-xs`}
              style={{ ...style, fontSize: '0.75rem', lineHeight: '1.4', backgroundColor: '#1e1e1e' }}
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

      {/* Chat message with instructions */}
      <div className="flex items-start gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-[#0e639c] flex items-center justify-center text-xs flex-shrink-0">
          AI
        </div>
        <div className="flex-1">
          <div className="text-[#cccccc] text-xs leading-relaxed">
            <p className="mb-2"><strong>How to practice:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-[#a0a0a0] ml-2">
              <li>Type the code from memory into the editor</li>
              <li>Try typing out an entire line without looking back</li>
              <li>Notice when you have to look back, and reflect on why</li>
            </ul>
            <p className="mt-3 text-[#a0a0a0] italic">
              Typing code from short-term memory requires you to "chunk" it, forcing you to notice patterns.  
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

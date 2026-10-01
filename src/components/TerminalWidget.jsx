import { useState, useRef, useEffect } from 'react';

const COMMANDS = {
  whoami: 'Tanxdai · Full-stack Engineer & AI Builder.\nCrafting ultra-responsive web apps & intelligent automations.',
  stack: 'Core: React 19 · TypeScript · Python · Vite · Tailwind · Framer Motion\nAI/ML: PyTorch · Gemini Live · LLM Workflows · Agents · Vector DBs',
  motto: 'Precision in code. Discipline in iron. Zero bloat.',
  specs: 'Architecture: Apple Silicon M-Series · macOS Darwin\nUptime: 99.98% · Status: Available for select client missions',
};

export default function TerminalWidget() {
  const [history, setHistory] = useState([
    { cmd: 'init', output: 'TANXDAI-OS Kernel v4.2.0-release\nType or click commands below to inspect system.' },
    { cmd: 'whoami', output: COMMANDS.whoami },
  ]);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const runCommand = (cmdKey) => {
    if (isTyping) return;
    if (cmdKey === 'clear') {
      setHistory([]);
      return;
    }

    const output = COMMANDS[cmdKey] || `bash: command not found: ${cmdKey}`;
    setIsTyping(true);
    setTypingText('');

    let idx = 0;
    const interval = setInterval(() => {
      idx += 2;
      if (idx >= output.length) {
        clearInterval(interval);
        setHistory((prev) => [...prev, { cmd: cmdKey, output }]);
        setTypingText('');
        setIsTyping(false);
      } else {
        setTypingText(output.slice(0, idx));
      }
    }, 14);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [history, typingText]);

  return (
    <div className="crt-terminal-container">
      <div className="crt-screen">
        <div className="crt-scanlines" aria-hidden="true" />
        
        {/* CRT Header Bar */}
        <div className="crt-header">
          <div className="crt-dots" aria-hidden="true">
            <span className="crt-dot red" />
            <span className="crt-dot yellow" />
            <span className="crt-dot green" />
          </div>
          <span className="crt-title">tanxdai@devbox:~ (tty1)</span>
          <span className="crt-tag">CRT-80x24</span>
        </div>

        {/* Terminal Output Area */}
        <div className="crt-body">
          {history.map((entry, idx) => (
            <div key={idx} className="crt-entry">
              <div className="crt-prompt">
                <span className="crt-user">tanxdai@kernel</span>
                <span className="crt-path">~$</span>
                <span className="crt-cmd">{entry.cmd}</span>
              </div>
              <pre className="crt-output">{entry.output}</pre>
            </div>
          ))}

          {isTyping && (
            <div className="crt-entry">
              <pre className="crt-output typing">
                {typingText}
                <span className="crt-cursor">█</span>
              </pre>
            </div>
          )}

          {!isTyping && (
            <div className="crt-prompt idle">
              <span className="crt-user">tanxdai@kernel</span>
              <span className="crt-path">~$</span>
              <span className="crt-cursor idle">█</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick Executable Command Buttons */}
        <div className="crt-footer-nav" aria-label="Terminal commands">
          <span className="crt-hint">EXEC:</span>
          {['whoami', 'stack', 'motto', 'specs', 'clear'].map((key) => (
            <button
              key={key}
              type="button"
              className="crt-btn"
              onClick={() => runCommand(key)}
              disabled={isTyping}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

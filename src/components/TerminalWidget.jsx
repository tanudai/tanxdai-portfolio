import { useState, useRef, useEffect } from 'react';

const COMMANDS = {
  whoami: 'Tanxdai · Full-Stack Engineer & AI Craftsman.\nPhilosophy: Fast interfaces, intelligent agents, zero fluff.\nMission: Building bespoke web products for select clients.',
  stack: 'Frontend: React 19 · TypeScript · Next.js · Vite · Motion\nAI & ML: Gemini Live API · PyTorch · Agents · Vector DBs\nBackend: Python · Node.js · Fastify · Docker · PostgreSQL · Redis',
  gym: 'Discipline: Consistency over motivation. 5-day hyper-split.\nIron PRs: Deadlift 240kg · Squat 175kg · Bench 140kg\nRecovery: Sleep 8h · Clean fuel · Cold focus',
  specs: 'Host: Apple Silicon M3 Max · 64GB Unified Memory\nKernel: Darwin 24.2.0 arm64 · Status: Online & Available\nLatency: 12ms · Uptime: 99.98% over 5+ production years',
  motto: 'Precision in code. Discipline in iron. Zero compromise.',
  about: 'I build bespoke web interfaces and AI-powered products.\n5+ years of building. Working remotely, worldwide.\nEqual parts design detail and engineering.',
  offclock: 'Away from the editor: iron, discipline, and a good soundtrack.\nThe gym has progressive overload. Code has progressive enhancement.',
  music: 'Current setup: a little vinyl, a little volume, a lot of focus.\nPlaylist: HIIT Workout on YouTube Music.\nTap the record or track chips below to spin preview audio.',
  debug: 'Checking for bugs…\nFound one between the keyboard and the chair.\nPatch: stand up, stretch, try again.',
  sudo: 'Permission denied.\nYou can have admin access to the playlist, not my life choices.',
  ping: 'Pinging motivation…\nRequest timed out.\nDiscipline is handling the request instead.',
  fortune: 'Your next great idea is probably hiding behind one small, unfinished task.\nShip that first.',
};

export default function TerminalWidget({ compact = false }) {
  const [history, setHistory] = useState(compact ? [{ cmd: 'whoami', output: COMMANDS.whoami }] : [
    {
      cmd: 'init',
      output: 'TANXDAI-OS v4.2.0 (arm64-apple-darwin) · Ready\nAll systems operational. Tap below to query runtime.'
    },
    {
      cmd: 'whoami',
      output: COMMANDS.whoami
    }
  ]);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingInterval = useRef(null);
  useEffect(() => () => clearInterval(typingInterval.current), []);

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
    const interval = typingInterval.current = setInterval(() => {
      idx += 3;
      if (idx >= output.length) {
        clearInterval(interval);
        setHistory((prev) => [...prev, { cmd: cmdKey, output }]);
        setTypingText('');
        setIsTyping(false);
      } else {
        setTypingText(output.slice(0, idx));
      }
    }, 12);
  };

  useEffect(() => {
    if (compact) {
      const body = bottomRef.current?.parentElement;
      if (body) body.scrollTop = body.scrollHeight;
    } else {
      bottomRef.current?.scrollIntoView?.({ behavior: 'smooth' });
    }
  }, [history, typingText, compact]);

  const commandPresets = [
    { key: 'whoami', label: '👤 whoami' },
    { key: 'stack', label: '⚡ stack' },
    { key: 'gym', label: '🏋️ gym' },
    { key: 'specs', label: '💻 specs' },
    ...(compact ? [
      { key: 'about', label: 'about' },
      { key: 'offclock', label: 'offclock' },
      { key: 'music', label: 'music' },
      { key: 'motto', label: 'motto' },
      { key: 'debug', label: 'debug' },
      { key: 'sudo', label: 'sudo' },
      { key: 'ping', label: 'ping' },
      { key: 'fortune', label: 'fortune' },
    ] : []),
    { key: 'clear', label: '🧹 clear' },
  ];

  return (
    <div className="crt-terminal-container" data-decorative="true">
      <div className="crt-screen">
        <div className="crt-scanlines" aria-hidden="true" />
        
        {/* CRT Header Bar */}
        <div className="crt-header" data-decorative="true">
          <div className="crt-dots" aria-hidden="true">
            <span className="crt-dot red" />
            <span className="crt-dot yellow" />
            <span className="crt-dot green" />
          </div>
          <span className="crt-title">tanxdai@devbox:~ (tty1)</span>
          <span className="crt-tag">LIVE · 99.98%</span>
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
        {compact ? (
          <div className="crt-compact-nav" aria-label="Terminal commands">
            <span className="crt-hint" aria-hidden="true">$</span>
            {commandPresets.slice(0, 4).map((preset) => (
              <button
                key={preset.key}
                type="button"
                className="crt-btn"
                onClick={() => runCommand(preset.key)}
                disabled={isTyping}
              >
                {preset.key}
              </button>
            ))}
          </div>
        ) : (
          <div className="crt-footer-nav" aria-label="Terminal commands">
            <span className="crt-hint">EXEC:</span>
            {commandPresets.map((preset) => (
              <button
                key={preset.key}
                type="button"
                className="crt-btn"
                onClick={() => runCommand(preset.key)}
                disabled={isTyping}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

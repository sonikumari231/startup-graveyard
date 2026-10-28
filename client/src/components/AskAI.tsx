import { useEffect, useRef, useState, type Dispatch, type KeyboardEvent, type SetStateAction } from "react";
import { askChat } from "../api";
import { offlineAnswer } from "../lib/offlineAnswer";
import type { Case, ChatMsg } from "../types";

const SUGGESTIONS = [
  "Why did Quibi fail?",
  "Which startups ran out of cash?",
  "What went wrong with Indian startups?",
  "Which hardware startups failed and why?",
  "What do Webvan and Kozmo have in common?",
];

interface Props {
  cases: Case[];
  messages: ChatMsg[];
  setMessages: Dispatch<SetStateAction<ChatMsg[]>>;
  onOpen: (id: string) => void;
}

export default function AskAI({ cases, messages, setMessages, onOpen }: Props) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  async function send(raw: string) {
    const message = raw.trim();
    if (!message || busy) return;
    const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", content: message };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setBusy(true);
    let reply: ChatMsg;
    try {
      const r = await askChat({ message, history });
      reply = { id: crypto.randomUUID(), role: "assistant", content: r.answer, sources: r.sources };
    } catch {
      const lastSources = [...messages].reverse().find((m) => m.role === "assistant" && m.sources?.length)?.sources ?? [];
      const r = offlineAnswer(message, cases, lastSources.map((x) => x.id));
      reply = { id: crypto.randomUUID(), role: "assistant", content: r.answer, sources: r.sources, demo: true };
    }
    setMessages((m) => [...m, reply]);
    setBusy(false);
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(text); }
  };

  return (
    <div className="pane">
      <section className="chat" aria-label="Ask the graveyard">
        <div className="chat-head">
          <h2>Ask the graveyard</h2>
          <p className="note">Ask why a startup failed, or look for patterns. Answers come from the cases in this site, and each one lists the startups it used.</p>
        </div>

        <div className="chat-log" ref={logRef} role="log" aria-live="polite">
          {!messages.length && (
            <div className="chat-empty">
              <span className="label">Try one of these</span>
              <div className="cats" style={{ justifyContent: "flex-start" }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="catb" onClick={() => void send(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={"msg " + m.role}>
              <span className="label">{m.role === "user" ? "You" : "Graveyard AI"}</span>
              <p className="msg-text">{m.content}</p>
              {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                <div className="chips">
                  <span className="label" style={{ alignSelf: "center" }}>Based on</span>
                  {m.sources.map((s) => (
                    <button key={s.id} type="button" className="mini" onClick={() => onOpen(s.id)}>{s.name} ↗</button>
                  ))}
                </div>
              )}
              {m.demo && <span className="mono meta">Offline demo answer. It matched keywords in the sample data and did not use an LLM. Connect POST /api/chat for real answers.</span>}
            </div>
          ))}
          {busy && <div className="msg assistant"><span className="label">Graveyard AI</span><p className="msg-text thinking">Searching the graveyard…</p></div>}
        </div>

        <form className="chat-form" onSubmit={(e) => { e.preventDefault(); void send(text); }}>
          <label className="label" htmlFor="chat-input" style={{ position: "absolute", left: -9999 }}>Your question</label>
          <textarea id="chat-input" rows={2} placeholder="Ask about a startup, a cause, or a sector" value={text}
            onChange={(e) => setText(e.target.value)} onKeyDown={onKey} />
          <button className="btn primary" type="submit" disabled={busy || !text.trim()}>{busy ? "Thinking…" : "Ask"}</button>
        </form>
        {messages.length > 0 && (
          <button className="mini" type="button" style={{ alignSelf: "flex-start" }} onClick={() => setMessages([])}>Clear chat</button>
        )}
      </section>
    </div>
  );
}

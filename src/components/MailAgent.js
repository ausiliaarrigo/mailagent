"use client";
import { useState, useRef, useEffect } from "react";

/* ─── DATI DI ESEMPIO ─────────────────────────────────────────────────────── */
/* Sostituisci questi con le tue email reali, oppure lascia come demo */
const ACCOUNTS = [
  { id: "all",    label: "Tutte",  color: "#4f8ef7" },
  { id: "gmail",  label: "Gmail",  color: "#f87171" },
  { id: "icloud", label: "iCloud", color: "#60a5fa" },
  { id: "work",   label: "Lavoro", color: "#34d399" },
];

const EMAILS = [
  { id: 1, account: "gmail",  sender: "Luca Bianchi",      subject: "Proposta collaborazione Q2",          preview: "Ciao! Volevo discutere con te di un progetto...",          time: "09:14", body: "Ciao! Volevo discutere con te di un progetto interessante per il Q2. Ho alcune idee da condividere riguardo alla nostra collaborazione futura. Potresti fissare una call questa settimana?", unread: true  },
  { id: 2, account: "work",   sender: "Slack Notifiche",   subject: "5 nuovi messaggi nel canale #dev",    preview: "Marco ha condiviso un documento, Sara ha risposto...",       time: "08:51", body: "Nel canale #dev ci sono 5 nuovi messaggi. Marco ha condiviso il documento 'Architettura v2.3'. Sara ha risposto al thread sul bug #451. Fabio ha aggiunto un commento alla PR #89.", unread: true  },
  { id: 3, account: "icloud", sender: "Apple",             subject: "Il tuo abbonamento iCloud è rinnovato", preview: "Il pagamento di €0,99 è stato elaborato...",              time: "07:30", body: "Il pagamento mensile di €0,99 per iCloud+ 50GB è stato elaborato con successo. Il prossimo rinnovo sarà il 6 maggio 2026.", unread: false },
  { id: 4, account: "gmail",  sender: "Newsletter AI Weekly", subject: "GPT-5 e i nuovi modelli di ragionamento", preview: "Questa settimana: i nuovi rilasci nel mondo AI...",    time: "Ieri",  body: "Questa settimana nell'AI: nuovi miglioramenti al ragionamento multi-step, risultati sui modelli costituzionali, e aggiornamenti multimodali.", unread: true  },
  { id: 5, account: "work",   sender: "Giorgia Ferretti",  subject: "Re: Meeting di giovedì — agenda",     preview: "Ho aggiornato l'agenda con i tuoi commenti...",             time: "Ieri",  body: "Ho aggiornato l'agenda con i tuoi commenti. Puoi confermare la tua presenza? Ordine del giorno: revisione roadmap (30min), demo prodotto (20min), Q&A (10min).", unread: false },
  { id: 6, account: "gmail",  sender: "Amazon",            subject: "Il tuo ordine è stato spedito",       preview: "L'ordine #302-9921 è partito dal magazzino...",             time: "Lun",   body: "L'ordine #302-9921 è partito dal magazzino di Piacenza. Consegna prevista: mercoledì 8 aprile. Codice tracciamento: IT9921882B.", unread: false },
  { id: 7, account: "icloud", sender: "Nicola Conti",      subject: "Foto del weekend — link condivisione", preview: "Ciao! Ho caricato le foto del weekend in montagna...",     time: "Dom",   body: "Ciao! Ho caricato le foto del weekend in montagna su iCloud. Eccoti il link per accedere all'album condiviso. Ce ne sono circa 200!", unread: true  },
];

/* ─── HELPERS ─────────────────────────────────────────────────────────────── */
function getAccountColor(id) {
  return ACCOUNTS.find(a => a.id === id)?.color ?? "#6b7280";
}
function nowTime() {
  return new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

/* ─── STYLES ──────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d0f14; --surface: #161920; --surface2: #1e2230; --border: #2a2f42;
    --accent: #4f8ef7; --accent2: #a78bfa; --danger: #f87171; --success: #34d399;
    --warn: #fbbf24; --text: #e8eaf2; --muted: #6b7280;
    --mono: 'DM Mono', monospace; --sans: 'DM Sans', sans-serif;
  }
  html, body { background: var(--bg); color: var(--text); font-family: var(--sans); height: 100%; }
  #__next, .app-root { height: 100%; }

  .app { display: flex; flex-direction: column; height: 100dvh; max-width: 430px; margin: 0 auto; background: var(--bg); overflow: hidden; }
  @media (min-width: 768px)  { .app { max-width: 768px; } }
  @media (min-width: 1024px) { .app { max-width: 1200px; flex-direction: row; } }

  /* HEADER */
  .header { padding: 16px 20px 12px; border-bottom: 1px solid var(--border); background: var(--surface); flex-shrink: 0; }
  @media (min-width: 1024px) { .header { width: 340px; border-right: 1px solid var(--border); border-bottom: none; } }
  .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .logo { font-family: var(--mono); font-size: 13px; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success); box-shadow: 0 0 8px var(--success); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.3} }
  .accounts-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
  .accounts-row::-webkit-scrollbar { display: none; }
  .chip { flex-shrink: 0; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; border: 1px solid var(--border); background: transparent; color: var(--muted); cursor: pointer; transition: all .2s; font-family: var(--sans); }
  .chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }
  .chip:hover:not(.active) { border-color: var(--accent); color: var(--text); }

  /* MAIN */
  .main { flex: 1; display: flex; overflow: hidden; }

  /* EMAIL LIST */
  .email-panel { display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0; }
  @media (max-width: 1023px) { .email-panel { flex: 1; } }
  @media (min-width: 1024px) { .email-panel { width: 340px; border-right: 1px solid var(--border); } }
  .section-label { padding: 8px 20px; font-family: var(--mono); font-size: 10px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; background: var(--bg); border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .email-list { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
  .email-item { padding: 13px 20px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background .15s; position: relative; }
  .email-item:hover { background: var(--surface); }
  .email-item.selected { background: var(--surface2); border-left: 3px solid var(--accent); padding-left: 17px; }
  .unread-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); position: absolute; left: 8px; top: 18px; }
  .email-row1 { display: flex; align-items: center; margin-bottom: 3px; gap: 6px; }
  .email-sender { font-size: 13px; font-weight: 500; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .email-item.unread .email-sender { font-weight: 600; }
  .acct-tag { font-size: 10px; font-family: var(--mono); padding: 2px 5px; border-radius: 4px; flex-shrink: 0; }
  .email-time { font-size: 11px; color: var(--muted); font-family: var(--mono); flex-shrink: 0; }
  .email-subject { font-size: 12px; color: var(--text); margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .email-item.unread .email-subject { font-weight: 600; }
  .email-preview { font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* EMAIL DETAIL */
  .email-detail { display: none; }
  @media (min-width: 768px) {
    .email-detail { display: flex; flex-direction: column; width: 340px; border-right: 1px solid var(--border); overflow-y: auto; padding: 20px; flex-shrink: 0; }
  }
  @media (min-width: 1024px) { .email-detail { width: 380px; } }
  .detail-subject { font-size: 15px; font-weight: 600; margin-bottom: 6px; line-height: 1.35; }
  .detail-meta { font-size: 11px; color: var(--muted); font-family: var(--mono); margin-bottom: 14px; line-height: 1.6; }
  .detail-body { font-size: 13px; line-height: 1.75; color: #c5c8d8; flex: 1; }
  .detail-actions { display: flex; gap: 8px; margin-top: 18px; flex-wrap: wrap; }
  .dbtn { padding: 8px 13px; border-radius: 10px; font-size: 12px; font-weight: 600; border: 1px solid; cursor: pointer; font-family: var(--sans); transition: all .15s; background: transparent; }
  .dbtn.del { color: var(--danger); border-color: rgba(248,113,113,.3); }
  .dbtn.del:hover { background: rgba(248,113,113,.15); }
  .dbtn.sum { color: var(--warn); border-color: rgba(251,191,36,.3); }
  .dbtn.sum:hover { background: rgba(251,191,36,.1); }
  .dbtn.read { color: var(--accent); border-color: rgba(79,142,247,.3); }
  .dbtn.read:hover { background: rgba(79,142,247,.1); }
  .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; color: var(--muted); gap: 8px; padding: 40px 20px; text-align: center; }
  .empty-icon { font-size: 32px; }
  .empty-text { font-size: 13px; line-height: 1.5; }

  /* CHAT */
  .chat-panel { display: flex; flex-direction: column; background: var(--surface); border-top: 1px solid var(--border); height: 46vh; flex-shrink: 0; }
  @media (min-width: 768px) { .chat-panel { height: 44vh; } }
  @media (min-width: 1024px) { .chat-panel { flex: 1; height: auto; border-top: none; } }
  .chat-header { padding: 11px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .chat-icon { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg,var(--accent),var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .chat-title { font-size: 13px; font-weight: 600; }
  .chat-sub { font-size: 11px; color: var(--muted); }
  .messages { flex: 1; overflow-y: auto; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
  .msg { max-width: 88%; display: flex; flex-direction: column; gap: 3px; animation: msgIn .2s ease; }
  @keyframes msgIn { from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)} }
  .msg.user { align-self: flex-end; }
  .msg.assistant { align-self: flex-start; }
  .bubble { padding: 9px 13px; border-radius: 14px; font-size: 13px; line-height: 1.55; white-space: pre-wrap; word-break: break-word; }
  .msg.user .bubble { background: var(--accent); color: #fff; border-bottom-right-radius: 4px; }
  .msg.assistant .bubble { background: var(--surface2); color: var(--text); border-bottom-left-radius: 4px; border: 1px solid var(--border); }
  .msg-time { font-size: 10px; color: var(--muted); font-family: var(--mono); padding: 0 4px; }
  .msg.user .msg-time { text-align: right; }
  .typing { display: flex; gap: 4px; align-items: center; padding: 2px 0; }
  .typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); animation: bounce .8s infinite; }
  .typing span:nth-child(2){animation-delay:.15s} .typing span:nth-child(3){animation-delay:.3s}
  @keyframes bounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
  .quick-actions { display: flex; gap: 6px; overflow-x: auto; padding: 8px 12px 0; scrollbar-width: none; flex-shrink: 0; }
  .quick-actions::-webkit-scrollbar { display: none; }
  .qa { flex-shrink: 0; padding: 5px 11px; border-radius: 20px; font-size: 11px; font-weight: 500; border: 1px solid var(--border); background: transparent; color: var(--muted); cursor: pointer; font-family: var(--sans); transition: all .15s; }
  .qa:hover { border-color: var(--accent); color: var(--accent); }
  .input-area { padding: 10px 12px 14px; border-top: 1px solid var(--border); display: flex; gap: 8px; align-items: flex-end; flex-shrink: 0; }
  .chat-input { flex: 1; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 9px 14px; color: var(--text); font-family: var(--sans); font-size: 14px; resize: none; outline: none; max-height: 90px; transition: border-color .2s; line-height: 1.4; }
  .chat-input:focus { border-color: var(--accent); }
  .chat-input::placeholder { color: var(--muted); }
  .send-btn { width: 38px; height: 38px; border-radius: 10px; background: var(--accent); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #fff; flex-shrink: 0; transition: background .2s, transform .1s; line-height: 1; }
  .send-btn:hover { background: #3a7ae8; }
  .send-btn:active { transform: scale(.93); }
  .send-btn:disabled { background: var(--border); cursor: not-allowed; }
`;

/* ─── COMPONENT ───────────────────────────────────────────────────────────── */
export default function MailAgent() {
  const [activeAccount, setActiveAccount] = useState("all");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "Ciao! 👋 Sono il tuo assistente email.\n\nPosso farti un recap delle caselle, riassumere o analizzare email, e proporti quali cancellare — ma non eseguirò mai nessuna azione senza la tua conferma esplicita. Le email non lette restano tali finché non decidi tu.\n\nCome posso aiutarti?",
    time: nowTime(),
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const filtered = activeAccount === "all" ? EMAILS : EMAILS.filter(e => e.account === activeAccount);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(text) {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", text, time: nowTime() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const apiMsgs = next.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMsgs, emails: EMAILS }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.text || data.error || "Errore.", time: nowTime() }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "⚠️ Errore di connessione.", time: nowTime() }]);
    }
    setLoading(false);
  }

  function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }

  function emailAction(action, email) {
    const p = {
      delete: `Vorrei cancellare questa email: "${email.subject}" da ${email.sender}. Cosa mi proponi?`,
      summary: `Riassumi questa email senza segnarla come letta: "${email.subject}" da ${email.sender}. Corpo: "${email.body}"`,
      read: `Analizza in dettaglio questa email senza segnarla come letta: "${email.subject}" da ${email.sender}. Corpo: "${email.body}"`,
    };
    send(p[action]);
  }

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* HEADER / ACCOUNT SELECTOR */}
        <div className="header">
          <div className="header-top">
            <span className="logo">⌁ MailAgent</span>
            <div className="status-dot" />
          </div>
          <div className="accounts-row">
            {ACCOUNTS.map(a => (
              <button key={a.id} className={`chip ${activeAccount === a.id ? "active" : ""}`} onClick={() => setActiveAccount(a.id)}>
                {a.label}{a.id !== "all" && ` (${EMAILS.filter(e => e.account === a.id).length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="main">

          {/* EMAIL LIST */}
          <div className="email-panel">
            <div className="section-label">
              {filtered.length} messaggi{filtered.filter(e=>e.unread).length > 0 && ` · ${filtered.filter(e=>e.unread).length} non letti`}
            </div>
            <div className="email-list">
              {filtered.map(email => (
                <div key={email.id} className={`email-item ${email.unread?"unread":""} ${selectedEmail?.id===email.id?"selected":""}`} onClick={() => setSelectedEmail(email)}>
                  {email.unread && <div className="unread-dot" />}
                  <div className="email-row1">
                    <span className="email-sender">{email.sender}</span>
                    <span className="acct-tag" style={{ background: getAccountColor(email.account)+"22", color: getAccountColor(email.account) }}>{email.account}</span>
                    <span className="email-time">{email.time}</span>
                  </div>
                  <div className="email-subject">{email.subject}</div>
                  <div className="email-preview">{email.preview}</div>
                </div>
              ))}
            </div>
          </div>

          {/* EMAIL DETAIL — tablet/desktop */}
          <div className="email-detail">
            {selectedEmail ? (
              <>
                <div className="detail-subject">{selectedEmail.subject}</div>
                <div className="detail-meta">Da: {selectedEmail.sender}<br />{selectedEmail.time} · {selectedEmail.account}</div>
                <div className="detail-body">{selectedEmail.body}</div>
                <div className="detail-actions">
                  <button className="dbtn del" onClick={() => emailAction("delete", selectedEmail)}>🗑 Proponi cancellazione</button>
                  <button className="dbtn sum" onClick={() => emailAction("summary", selectedEmail)}>📝 Riassumi</button>
                  <button className="dbtn read" onClick={() => emailAction("read", selectedEmail)}>📖 Analizza</button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✉️</div>
                <div className="empty-text">Seleziona un'email<br />per visualizzarla</div>
              </div>
            )}
          </div>

          {/* CHAT */}
          <div className="chat-panel">
            <div className="chat-header">
              <div className="chat-icon">🤖</div>
              <div>
                <div className="chat-title">Assistente AI</div>
                <div className="chat-sub">Confermo sempre prima di agire</div>
              </div>
            </div>

            <div className="messages">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>
                  <div className="bubble">{m.text}</div>
                  <div className="msg-time">{m.time}</div>
                </div>
              ))}
              {loading && (
                <div className="msg assistant">
                  <div className="bubble"><div className="typing"><span/><span/><span/></div></div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="quick-actions">
              {["Recap di tutto","Proponi cancellazioni","Email urgenti?","Riassumi lavoro","Non lette"].map(q => (
                <button key={q} className="qa" onClick={() => send(q)}>{q}</button>
              ))}
            </div>

            <div className="input-area">
              <textarea className="chat-input" rows={1} placeholder="Istruisci l'agente…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} />
              <button className="send-btn" onClick={() => send(input)} disabled={!input.trim() || loading}>↑</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

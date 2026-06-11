import { useState, useEffect } from "react";

// ============================================================
//  SUPABASE CONFIG
// ============================================================
const SUPABASE_URL = "https://utijjoiiwbdnqtdnsekq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0aWpqb2lpd2JkbnF0ZG5zZWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTA1OTQsImV4cCI6MjA5NjU4NjU5NH0.TCD3ER3XU_IbDlKgNdh5PNdeXUe_eat5kWRIngP4pqA";

const dbHeaders = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
};

async function saveEntry(payload) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
      method: "POST",
      headers: { ...dbHeaders, "Prefer": "return=minimal" },
      body: JSON.stringify({
        nickname: payload.nickname,
        gender: payload.gender,
        age_group: payload.age_group,
        score: payload.score,
        responses: payload.responses,
        email: payload.email || null,
        want_report: payload.want_report || false,
        want_contact: payload.want_contact || false,
      }),
    });
    return res.ok;
  } catch (e) {
    console.error("Save error:", e);
    return false;
  }
}

async function getLeaderboard() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/scores?select=nickname,email,score&order=score.desc&limit=500`,
      { headers: dbHeaders }
    );
    return await res.json();
  } catch (e) { return []; }
}

// ============================================================
//  QUESTIONS — edit here!
// ============================================================
const QUESTIONS = [
  { question: "Det är viktigt att Sverige har ett starkt militärt försvar.", answer: 86 },
  { question: "Sverige bör införa Euro som valuta.", answer: 24 },
  { question: "Kriminaliteten i samhället oroar mig.", answer: 88 },
  { question: "Sverige bör ta emot fler flyktingar än idag.", answer: 23 },
  { question: "Jag föredrar vegetarisk kost.", answer: 19 },
  { question: "Sverige bör lämna EU.", answer: 15 },
  { question: "Klimatförändringarna oroar mig.", answer: 71 },
  { question: "Jag identifierar mig/känner samhörighet med HBTQI-rörelsen.", answer: 14 },
  { question: "Utbyggnad av svensk kärnkraft de kommande åren är nödvändig för ett stabilt och pålitligt energisystem i Sverige.", answer: 55 },
  { question: "Min religiösa tro är väldigt viktig för mig.", answer: 17 },
];
// ============================================================

// Score per question: 100 pts if exact, 0 pts if 29+ off
const calcScore = (guess, answer) => Math.max(0, Math.round(100 - Math.abs(guess - answer) * 3.5));

// Final pct: average score across all questions (0–100)
const calcFinalPct = (scores) => {
  if (!scores.length) return 0;
  return Math.min(100, Math.round(scores.reduce((a, b) => a + b, 0) / scores.length));
};

const getCommentary = (diff) => {
  if (diff <= 3)  return { text: "Otroligt! Du är ett mänskligt SIFO-institut.", emoji: "🎯" };
  if (diff <= 8)  return { text: "Riktigt bra! Du har koll på svenska folksjälen.", emoji: "🔥" };
  if (diff <= 15) return { text: "Hyfsad gissning — du är minst lika träffsäker som en meteorolog.", emoji: "🤔" };
  if (diff <= 25) return { text: "Hmmm.. dags att mingla med lite fler människor?", emoji: "😬" };
  return { text: "Var bor du egentligen?", emoji: "😅" };
};

const COLORS = {
  navy: "#1a2f4e", navyLight: "#243d63", navyDark: "#0f1e33",
  blue: "#2c6fad", blueLight: "#4a8fd4", accent: "#e8a020",
  white: "#ffffff", offWhite: "#f4f7fb", gray: "#8a9bb0",
  lightGray: "#d6e0ec", green: "#2ecc71", red: "#e74c3c",
};

const s = {
  wrap: { fontFamily: "sans-serif", background: COLORS.offWhite, minHeight: "100vh", color: COLORS.navy },
  header: { background: COLORS.navy, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16 },
  sub: { color: COLORS.gray, fontSize: 18, fontWeight: 500 },
  card: { background: COLORS.white, borderRadius: 14, padding: 28, margin: "20px auto", maxWidth: 660, boxShadow: "0 2px 12px rgba(26,47,78,0.08)" },
  btn: { background: COLORS.blue, color: COLORS.white, border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  btnAccent: { background: COLORS.accent, color: COLORS.navyDark, border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  tag: { display: "inline-block", background: COLORS.navyLight, color: COLORS.white, borderRadius: 20, padding: "3px 12px", fontSize: 12, marginBottom: 12 },
  input: { width: "100%", border: `1.5px solid ${COLORS.lightGray}`, borderRadius: 8, padding: "10px 14px", fontSize: 15, color: COLORS.navy, outline: "none", boxSizing: "border-box", background: COLORS.white },
};

function Logo() {
  return (
    <svg width="90" height="44" viewBox="0 0 90 44" role="img" aria-label="SIFO">
      <rect width="90" height="44" rx="6" fill="#0032ff"/>
      <text x="45" y="31" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="22" letterSpacing="4" fill="#ffffff">SIFO</text>
    </svg>
  );
}

function ToggleButton({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "10px 6px", fontSize: 14, fontWeight: 600, cursor: "pointer",
      borderRadius: 8, border: `2px solid ${selected ? COLORS.blue : COLORS.lightGray}`,
      background: selected ? COLORS.blue : COLORS.white,
      color: selected ? COLORS.white : COLORS.navy, transition: "all 0.15s",
    }}>{label}</button>
  );
}

function ProfileScreen({ onDone }) {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const canProceed = nickname.trim() && gender && age;
  return (
    <div style={{ ...s.card, maxWidth: 520 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 36, marginBottom: 6 }}>📊</div>
        <h1 style={{ color: COLORS.navy, fontSize: 22, margin: "0 0 6px", fontWeight: 700 }}>SIFO Insiktskollen</h1>
        <p style={{ color: COLORS.gray, fontSize: 14, margin: 0 }}>Gissa hur Svenskarna svarar — jämför med verkligheten!</p>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 6 }}>Ditt namn / smeknamn</label>
        <input style={s.input} placeholder="Vad ska vi kalla dig?" value={nickname} maxLength={30} onChange={e => setNickname(e.target.value)} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 8 }}>Kön</label>
        <div style={{ display: "flex", gap: 8 }}>
          {["Man", "Kvinna", "Annat"].map(g => <ToggleButton key={g} label={g} selected={gender === g} onClick={() => setGender(g)} />)}
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 8 }}>Ålder</label>
        <div style={{ display: "flex", gap: 8 }}>
          {["15-29", "30-49", "50-69", "70+"].map(a => <ToggleButton key={a} label={a} selected={age === a} onClick={() => setAge(a)} />)}
        </div>
      </div>
      <button style={{ ...s.btnAccent, width: "100%", opacity: canProceed ? 1 : 0.4 }} disabled={!canProceed}
        onClick={() => onDone({ nickname: nickname.trim(), gender, age_group: age })}>
        Starta spelet 🇸🇪
      </button>
      <p style={{ fontSize: 11, color: COLORS.gray, textAlign: "center", marginTop: 10 }}>
        {QUESTIONS.length} frågor · Jämför med andra spelare · Tävla om pris
      </p>
    </div>
  );
}

function QuestionScreen({ question, qIndex, total, onSubmit }) {
  const [guess, setGuess] = useState(50);
  return (
    <div style={s.card}>
      <span style={s.tag}>Fråga {qIndex + 1} av {total}</span>
      <p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 6 }}>Hur stor andel av Sveriges befolkning håller med om påståendet?</p>
      <h2 style={{ color: COLORS.navy, fontSize: 22, margin: "0 0 32px", fontWeight: 700, lineHeight: 1.45, animation: "fadeIn 0.4s ease" }}>"{question.question}"</h2>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 14, color: COLORS.gray }}>0%</span>
        <span style={{ fontSize: 28, fontWeight: 700, color: COLORS.blue }}>{guess}%</span>
        <span style={{ fontSize: 14, color: COLORS.gray }}>100%</span>
      </div>
      <input type="range" min={0} max={100} value={guess} onChange={e => setGuess(Number(e.target.value))}
        style={{ width: "100%", accentColor: COLORS.blue, height: 8, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, marginBottom: 28 }}>
        {[0,10,20,30,40,50,60,70,80,90,100].map(v => <span key={v} style={{ fontSize: 10, color: COLORS.lightGray }}>{v}</span>)}
      </div>
      <button style={s.btn} onClick={() => onSubmit(guess)}>Visa svaret →</button>
    </div>
  );
}

function RevealScreen({ question, guess, score, onNext, isLast }) {
  const diff = Math.abs(guess - question.answer);
  const { text, emoji } = getCommentary(diff);
  const isGood = score >= 60;
  function Bar({ label, value, color }) {
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: COLORS.navy, fontWeight: 500 }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}%</span>
        </div>
        <div style={{ background: COLORS.lightGray, borderRadius: 6, height: 22, overflow: "hidden" }}>
          <div style={{ width: `${value}%`, background: color, height: "100%", borderRadius: 6, transition: "width 0.7s ease" }} />
        </div>
      </div>
    );
  }
  return (
    <div style={s.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: COLORS.navy, fontSize: 16 }}>Rätt svar</h3>
        <div style={{ background: isGood ? COLORS.green : COLORS.red, color: COLORS.white, borderRadius: 20, padding: "4px 16px", fontWeight: 700, fontSize: 15 }}>{score} poäng</div>
      </div>
      <p style={{ fontSize: 15, fontStyle: "italic", marginBottom: 22, background: COLORS.offWhite, borderRadius: 8, padding: "12px 16px", lineHeight: 1.5 }}>{emoji} {text}</p>
      <Bar label="Din gissning" value={guess} color={COLORS.blueLight} />
      <Bar label="Verkligt svar (SIFO)" value={question.answer} color={COLORS.green} />
      <p style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>Du missade med <strong style={{ color: diff <= 5 ? COLORS.green : COLORS.red }}>{diff} procentenheter</strong>.</p>
      <div style={{ marginTop: 24 }}>
        <button style={s.btn} onClick={onNext}>{isLast ? "Se ditt slutresultat 🏆" : "Nästa fråga →"}</button>
      </div>
    </div>
  );
}

function Checkbox({ id, checked, onChange, children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
      <input type="checkbox" id={id} checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ marginTop: 3, accentColor: COLORS.blue, width: 17, height: 17, cursor: "pointer", flexShrink: 0 }} />
      <label htmlFor={id} style={{ fontSize: 14, color: COLORS.navyDark, cursor: "pointer", lineHeight: 1.5 }}>{children}</label>
    </div>
  );
}

function ResultScreen({ scores, profile, guesses }) {
  const [board, setBoard] = useState(null);
  const [email, setEmail] = useState("");
  const [wantCompete, setWantCompete] = useState(false);
  const [wantReport, setWantReport] = useState(false);
  const [wantContact, setWantContact] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [entrySaved, setEntrySaved] = useState(false);
  const [contactName, setContactName] = useState("");
  const [company, setCompany] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [phone, setPhone] = useState("");

  // Score is average of per-question scores, capped 0–100
  const pct = calcFinalPct(scores);
  const needsEmail = wantCompete || wantReport || wantContact;

  // Save score on mount (without email) then load leaderboard
  useEffect(() => {
    saveEntry({
      nickname: profile.nickname,
      gender: profile.gender,
      age_group: profile.age_group,
      score: pct,
      responses: guesses.join(","),
      email: null,
      want_report: false,
      want_contact: false,
    }).then(ok => {
      setEntrySaved(ok);
      getLeaderboard().then(data => setBoard(Array.isArray(data) ? data : []));
    });
  }, []);

  async function handleEmailSubmit() {
    if (!email.trim()) return;
    setSaving(true);
    // Update existing row by upserting with email + opt-ins
    await saveEntry({
      nickname: profile.nickname,
      gender: profile.gender,
      age_group: profile.age_group,
      score: pct,
      responses: guesses.join(","),
      email: email.trim(),
      want_report: wantReport,
      want_contact: wantContact,
      contact_name: contactName.trim() || null,
      company: company.trim() || null,
      title: contactTitle.trim() || null,
      phone: phone.trim() || null,
    });
    setSaving(false);
    setSubmitted(true);
  }

  const getVerdict = () => {
    if (pct >= 85) return { text: "Du är en SIFO-legend. Har du jobbat där?", emoji: "🏆" };
    if (pct >= 65) return { text: "Riktigt bra! Du förstår den genomsnittliga svensken.", emoji: "🥈" };
    if (pct >= 45) return { text: "Halvvägs dit. Du är minst lika förvirrad som Sverige.", emoji: "🤷" };
    return { text: "Är du säker på att du bor i Sverige?", emoji: "😅" };
  };

  const { text, emoji } = getVerdict();
  const sorted = board ? [...board].sort((a, b) => b.score - a.score) : [];
  const avg = sorted.length ? Math.round(sorted.reduce((a, b) => a + b.score, 0) / sorted.length) : null;
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)]?.score : null;
  const myRankIndex = sorted.findIndex(e => e.nickname === profile.nickname && e.score === pct);
  const rank = myRankIndex + 1;

  // Clamp beat% strictly between 0–100
  const beatPct = sorted.length > 1
    ? Math.min(100, Math.max(0, Math.round((sorted.filter(e => e.score < pct).length / sorted.length) * 100)))
    : null;

  const distBuckets = sorted.length ? (() => {
    const b = [0,0,0,0,0];
    sorted.forEach(e => { b[Math.min(4, Math.floor(e.score / 20))]++; });
    return b;
  })() : null;
  const maxBucket = distBuckets ? Math.max(...distBuckets, 1) : 1;
  const myBucket = Math.min(4, Math.floor(pct / 20));

  return (
    <div style={{ maxWidth: 660, margin: "0 auto" }}>
      <div style={{ ...s.card, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{emoji}</div>
        <h2 style={{ color: COLORS.navy, fontSize: 24, margin: "0 0 4px" }}>Bra jobbat, {profile.nickname}!</h2>
        <p style={{ color: COLORS.gray, fontSize: 15, marginBottom: 4 }}>Ditt resultat: <strong style={{ color: COLORS.blue }}>{pct}%</strong></p>
        <p style={{ color: COLORS.gray, fontSize: 14, marginBottom: 20 }}>{text}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
          <div><div style={{ fontSize: 28, fontWeight: 700, color: COLORS.blue }}>{pct}%</div><div style={{ fontSize: 12, color: COLORS.gray }}>Din poäng</div></div>
          {avg !== null && <div><div style={{ fontSize: 28, fontWeight: 700, color: COLORS.accent }}>{avg}%</div><div style={{ fontSize: 12, color: COLORS.gray }}>Snittet bland alla</div></div>}
          {beatPct !== null && <div><div style={{ fontSize: 28, fontWeight: 700, color: COLORS.green }}>{beatPct}%</div><div style={{ fontSize: 12, color: COLORS.gray }}>Bättre än</div></div>}
        </div>
      </div>

      <div style={s.card}>
        <h3 style={{ color: COLORS.navy, marginTop: 0, marginBottom: 6, fontSize: 16 }}>📬 Håll kontakten</h3>
        <p style={{ color: COLORS.gray, fontSize: 13, marginBottom: 18 }}>Välj vad du är intresserad av — vi hör bara av oss om du bockar i något.</p>
        {submitted ? (
          <div style={{ background: "#eafaf2", border: `1px solid ${COLORS.green}`, borderRadius: 8, padding: "14px 16px", fontSize: 14, color: "#1e8449" }}>
            ✓ Tack! Vi hör av oss till <strong>{email}</strong>.
          </div>
        ) : (
          <>
            <Checkbox id="compete" checked={wantCompete} onChange={setWantCompete}>
              <strong>🏆 Delta i tävlingen</strong> — vara med i utlottningen bland topplacerade spelare
            </Checkbox>
            <Checkbox id="report" checked={wantReport} onChange={setWantReport}>
              <strong>📄 Få rapporten</strong> — ta emot den fullständiga SIFO-rapporten när den är klar (om 4–6 veckor)
            </Checkbox>
            <Checkbox id="contact" checked={wantContact} onChange={setWantContact}>
              <strong>💼 Bli kontaktad</strong> — om du är intresserad av att köpa en egen undersökning
            </Checkbox>
            {needsEmail && (
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 6 }}>Din e-postadress</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <input style={s.input} type="email" placeholder="din@email.se" value={email} onChange={e => setEmail(e.target.value)} />
                  <button style={{ ...s.btn, whiteSpace: "nowrap", opacity: !email.trim() || saving ? 0.4 : 1 }}
                    disabled={!email.trim() || saving} onClick={handleEmailSubmit}>
                    {saving ? "…" : "Skicka"}
                  </button>
                </div>

                {wantContact && (
                  <div style={{ background: COLORS.offWhite, borderRadius: 10, padding: "16px", marginBottom: 12 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, margin: "0 0 4px" }}>Kontaktuppgifter <span style={{ fontWeight: 400, color: COLORS.gray }}>(valfritt)</span></p>
                    <p style={{ fontSize: 12, color: COLORS.gray, margin: "0 0 14px" }}>Fyll i om du vill att vi ska kunna nå dig direkt.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 12, color: COLORS.gray, display: "block", marginBottom: 4 }}>Namn</label>
                        <input style={{ ...s.input, fontSize: 14, padding: "8px 12px" }} placeholder="Anna Andersson" value={contactName} onChange={e => setContactName(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: COLORS.gray, display: "block", marginBottom: 4 }}>Företag</label>
                        <input style={{ ...s.input, fontSize: 14, padding: "8px 12px" }} placeholder="Företag AB" value={company} onChange={e => setCompany(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: COLORS.gray, display: "block", marginBottom: 4 }}>Titel</label>
                        <input style={{ ...s.input, fontSize: 14, padding: "8px 12px" }} placeholder="VD, Chef, etc." value={contactTitle} onChange={e => setContactTitle(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: COLORS.gray, display: "block", marginBottom: 4 }}>Telefon</label>
                        <input style={{ ...s.input, fontSize: 14, padding: "8px 12px" }} placeholder="070-000 00 00" value={phone} onChange={e => setPhone(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                <p style={{ fontSize: 11, color: COLORS.gray, marginTop: 4 }}>Din e-post används endast för de ändamål du valt ovan och delas inte vidare.</p>
              </div>
            )}
          </>
        )}
      </div>

      {!board && <div style={{ ...s.card, textAlign: "center", color: COLORS.gray }}>Laddar topplistan…</div>}

      {board && sorted.length > 0 && (
        <div style={s.card}>
          <h3 style={{ color: COLORS.navy, marginTop: 0, marginBottom: 6, fontSize: 16 }}>📊 Jämförelse med andra spelare</h3>
          <p style={{ color: COLORS.gray, fontSize: 13, marginBottom: 18 }}>{sorted.length} spelare totalt · Genomsnitt: {avg}% · Median: {median}%</p>
          {beatPct !== null && (
            <div style={{ background: pct >= avg ? "#eafaf2" : "#fef5e7", border: `1px solid ${pct >= avg ? COLORS.green : COLORS.accent}`, borderRadius: 8, padding: "10px 14px", marginBottom: 18, fontSize: 14, color: COLORS.navyDark }}>
              {pct >= avg ? `🎉 Du slår ${beatPct}% av alla spelare!` : `Du är under snittet — ${100 - beatPct}% av spelarna gissade bättre.`}
            </div>
          )}
          <div style={{ fontSize: 13, color: COLORS.gray, marginBottom: 10 }}>Poängfördelning (din stapel i orange):</div>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 90, marginBottom: 16 }}>
            {distBuckets.map((count, i) => {
              const labels = ["0–19%","20–39%","40–59%","60–79%","80–100%"];
              const barH = Math.max(4, Math.round((count / maxBucket) * 74));
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ fontSize: 11, color: COLORS.gray }}>{count}</div>
                  <div style={{ width: "100%", height: barH, background: myBucket === i ? COLORS.accent : COLORS.blue, borderRadius: "4px 4px 0 0", opacity: 0.85 }} />
                  <div style={{ fontSize: 10, color: myBucket === i ? COLORS.accent : COLORS.gray, fontWeight: myBucket === i ? 700 : 400, textAlign: "center", lineHeight: 1.3 }}>{labels[i]}</div>
                </div>
              );
            })}
          </div>
          <h4 style={{ color: COLORS.navy, fontSize: 14, marginBottom: 10 }}>Topplistan (bästa 10)</h4>
          {sorted.slice(0, 10).map((entry, i) => {
            const isMe = i === myRankIndex;
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 12px", borderRadius: 6, marginBottom: 4, background: isMe ? "#fff8e1" : i % 2 === 0 ? COLORS.offWhite : COLORS.white, border: isMe ? `1px solid ${COLORS.accent}` : "1px solid transparent" }}>
                <span style={{ fontSize: 14, color: COLORS.navy }}>#{i + 1} {entry.nickname} {entry.email ? "✉" : ""} {isMe && <strong>← Du</strong>}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.blue }}>{entry.score}%</span>
              </div>
            );
          })}
          {rank > 10 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 12px", borderRadius: 6, background: "#fff8e1", border: `1px solid ${COLORS.accent}`, marginTop: 4 }}>
              <span style={{ fontSize: 14, color: COLORS.navy }}>#{rank} {profile.nickname} <strong>← Du</strong></span>
              <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.blue }}>{pct}%</span>
            </div>
          )}
        </div>
      )}

      <div style={{ ...s.card, textAlign: "center" }}>
        <a href="https://www.fifty5blue.com/se" style={{ ...s.btnAccent, display: "inline-block", textDecoration: "none" }}>
          Besök SIFO →
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [lastGuess, setLastGuess] = useState(null);

  const q = QUESTIONS[qIndex];
  const totalScore = scores.reduce((a, b) => a + b, 0);
  const maxScore = QUESTIONS.length * 100;

  const handleProfileDone = (p) => { setProfile(p); setScreen("question"); };
  const handleSubmit = (guess) => {
    setLastGuess(guess);
    setScores(prev => [...prev, calcScore(guess, q.answer)]);
    setGuesses(prev => [...prev, guess]);
    setScreen("reveal");
  };
  const handleNext = () => {
    if (qIndex + 1 >= QUESTIONS.length) setScreen("result");
    else { setQIndex(qIndex + 1); setScreen("question"); }
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <Logo />
        <div style={s.sub}>Hur väl känner du Svenskarna?</div>
        {(screen === "question" || screen === "reveal") && profile && (
          <div style={{ marginLeft: 16, background: COLORS.navyLight, borderRadius: 8, padding: "6px 14px", color: COLORS.white, fontSize: 14 }}>
            {profile.nickname} · {totalScore} p
          </div>
        )}
      </div>
      <div style={{ padding: "8px 16px" }}>
        {screen === "profile"  && <ProfileScreen onDone={handleProfileDone} />}
        {screen === "question" && <QuestionScreen question={q} qIndex={qIndex} total={QUESTIONS.length} onSubmit={handleSubmit} />}
        {screen === "reveal"   && <RevealScreen question={q} guess={lastGuess} score={scores[scores.length - 1]} onNext={handleNext} isLast={qIndex + 1 >= QUESTIONS.length} />}
        {screen === "result"   && <ResultScreen scores={scores} profile={profile} guesses={guesses} />}
      </div>
    </div>
  );
}

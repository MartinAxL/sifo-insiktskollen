import { useState, useEffect } from "react";

// ============================================================
//  QUESTIONS — edit here!
//  Format: { question: "...", answer: 0–100 }
// ============================================================
const QUESTIONS = [
  {
    question: "Jag identifierar mig/känner samhörighet med HBTQI-rörelsen.",
    answer: 21,
  },
  // Add more questions below:
  // { question: "...", answer: 42 },
];
// ============================================================

const COLORS = {
  navy: "#1a2f4e",
  navyLight: "#243d63",
  navyDark: "#0f1e33",
  blue: "#2c6fad",
  blueLight: "#4a8fd4",
  accent: "#e8a020",
  white: "#ffffff",
  offWhite: "#f4f7fb",
  gray: "#8a9bb0",
  lightGray: "#d6e0ec",
  green: "#2ecc71",
  red: "#e74c3c",
};

function calcScore(guess, answer) {
  const diff = Math.abs(guess - answer);
  return Math.max(0, Math.round(100 - diff * 3.5));
}

async function saveScore(pct) {
  try {
    const res = await window.storage.get("sifo2_scores", true);
    const scores = res ? JSON.parse(res.value) : [];
    scores.push({ score: pct, ts: Date.now() });
    if (scores.length > 1000) scores.splice(0, scores.length - 1000);
    await window.storage.set("sifo2_scores", JSON.stringify(scores), true);
  } catch (e) {}
}

async function getLeaderboard() {
  try {
    const res = await window.storage.get("sifo2_scores", true);
    return res ? JSON.parse(res.value) : [];
  } catch (e) { return []; }
}

function getCommentary(diff) {
  if (diff <= 3)  return { text: "Otroligt! Du är ett mänskligt SIFO-institut.", emoji: "🎯" };
  if (diff <= 8)  return { text: "Riktigt bra! Du har koll på svenska folksjälen.", emoji: "🔥" };
  if (diff <= 15) return { text: "Hyfsad gissning — du är minst lika träffsäker som en meteorolog.", emoji: "🤔" };
  if (diff <= 25) return { text: "Hmm. Kanske dags att prata med fler svenskar?", emoji: "😬" };
  return { text: "Var bor du egentligen?", emoji: "😅" };
}

const s = {
  wrap: { fontFamily: "sans-serif", background: COLORS.offWhite, minHeight: "100vh", color: COLORS.navy },
  header: { background: COLORS.navy, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 },
  logo: { color: COLORS.white, fontSize: 22, fontWeight: 700, letterSpacing: -0.5 },
  sub: { color: COLORS.gray, fontSize: 13 },
  card: { background: COLORS.white, borderRadius: 14, padding: 28, margin: "20px auto", maxWidth: 660, boxShadow: "0 2px 12px rgba(26,47,78,0.08)" },
  btn: { background: COLORS.blue, color: COLORS.white, border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  btnAccent: { background: COLORS.accent, color: COLORS.navyDark, border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  tag: { display: "inline-block", background: COLORS.navyLight, color: COLORS.white, borderRadius: 20, padding: "3px 12px", fontSize: 12, marginBottom: 12 },
};

function StartScreen({ onStart, total }) {
  return (
    <div style={{ ...s.card, textAlign: "center", padding: "48px 28px" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
      <h1 style={{ color: COLORS.navy, fontSize: 26, margin: "0 0 10px", fontWeight: 700 }}>SIFO Gissaren</h1>
      <p style={{ color: COLORS.gray, fontSize: 15, marginBottom: 8 }}>Hur väl känner du den svenska folksjälen?</p>
      <p style={{ color: COLORS.navy, fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
        Vi visar ett påstående från en riktig undersökning. Du gissar hur stor andel (%) av Sveriges befolkning som håller med. Ju närmre sanningen — desto fler poäng!
      </p>
      <p style={{ color: COLORS.gray, fontSize: 13, marginBottom: 28 }}>{total} frågor · Jämför ditt resultat med andra spelare</p>
      <button style={s.btnAccent} onClick={onStart}>Starta spelet 🇸🇪</button>
    </div>
  );
}

function QuestionScreen({ question, qIndex, total, onSubmit }) {
  const [guess, setGuess] = useState(50);
  return (
    <div style={s.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={s.tag}>Fråga {qIndex + 1} av {total}</span>
      </div>
      <p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 6 }}>Hur stor andel av Sveriges befolkning håller med om påståendet?</p>
      <h2 style={{ color: COLORS.navy, fontSize: 19, margin: "0 0 32px", fontWeight: 700, lineHeight: 1.4 }}>
        "{question.question}"
      </h2>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: COLORS.gray }}>0%</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: COLORS.blue }}>{guess}%</span>
          <span style={{ fontSize: 14, color: COLORS.gray }}>100%</span>
        </div>
        <input
          type="range" min={0} max={100} value={guess}
          onChange={e => setGuess(Number(e.target.value))}
          style={{ width: "100%", accentColor: COLORS.blue, height: 8, cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {[0,10,20,30,40,50,60,70,80,90,100].map(v => (
            <span key={v} style={{ fontSize: 10, color: COLORS.lightGray }}>{v}</span>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 28 }}>
        <button style={s.btn} onClick={() => onSubmit(guess)}>Visa svaret →</button>
      </div>
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
        <div style={{ background: COLORS.lightGray, borderRadius: 6, height: 22, position: "relative", overflow: "hidden" }}>
          <div style={{ width: `${value}%`, background: color, height: "100%", borderRadius: 6, transition: "width 0.7s ease" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={s.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: COLORS.navy, fontSize: 16 }}>Rätt svar</h3>
        <div style={{ background: isGood ? COLORS.green : COLORS.red, color: COLORS.white, borderRadius: 20, padding: "4px 16px", fontWeight: 700, fontSize: 15 }}>
          {score} poäng
        </div>
      </div>
      <p style={{ fontSize: 15, color: COLORS.navy, fontStyle: "italic", marginBottom: 22, background: COLORS.offWhite, borderRadius: 8, padding: "12px 16px", lineHeight: 1.5 }}>
        {emoji} {text}
      </p>
      <Bar label="Din gissning" value={guess} color={COLORS.blueLight} />
      <Bar label="Verkligt svar (SIFO)" value={question.answer} color={COLORS.green} />
      <p style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>
        Du missade med <strong style={{ color: diff <= 5 ? COLORS.green : COLORS.red }}>{diff} procentenheter</strong>.
      </p>
      <div style={{ marginTop: 24 }}>
        <button style={s.btn} onClick={onNext}>{isLast ? "Se ditt slutresultat 🏆" : "Nästa fråga →"}</button>
      </div>
    </div>
  );
}

function ResultScreen({ totalScore, maxScore }) {
  const [board, setBoard] = useState(null);
  const pct = Math.round((totalScore / maxScore) * 100);

  useEffect(() => {
    saveScore(pct).then(() => {
      getLeaderboard().then(scores => {
        const sorted = [...scores].sort((a, b) => b.score - a.score);
        setBoard(sorted);
      });
    });
  }, []);

  function getVerdict() {
    if (pct >= 85) return { text: "Du är en SIFO-legend. Har du jobbat där?", emoji: "🏆" };
    if (pct >= 65) return { text: "Riktigt bra! Du förstår den genomsnittliga svensken.", emoji: "🥈" };
    if (pct >= 45) return { text: "Halvvägs dit. Du är minst lika förvirrad som Sverige.", emoji: "🤷" };
    return { text: "Är du säker på att du bor i Sverige?", emoji: "😅" };
  }

  const { text, emoji } = getVerdict();
  const avg = board && board.length ? Math.round(board.reduce((a, b) => a + b.score, 0) / board.length) : null;
  const median = board && board.length ? board[Math.floor(board.length / 2)]?.score : null;
  const myRankIndex = board ? board.findIndex(s => s.score === pct) : -1;
  const rank = myRankIndex + 1;
  const beatPct = board && board.length > 1 ? Math.round((board.filter(s => s.score < pct).length / (board.length - 1)) * 100) : null;

  const distBuckets = board ? (() => {
    const b = [0,0,0,0,0];
    board.forEach(s => { b[Math.min(4, Math.floor(s.score / 20))]++; });
    return b;
  })() : null;
  const maxBucket = distBuckets ? Math.max(...distBuckets, 1) : 1;
  const myBucket = Math.min(4, Math.floor(pct / 20));

  return (
    <div style={{ maxWidth: 660, margin: "0 auto" }}>
      <div style={{ ...s.card, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{emoji}</div>
        <h2 style={{ color: COLORS.navy, fontSize: 24, margin: "0 0 8px" }}>Ditt resultat: {pct}%</h2>
        <p style={{ color: COLORS.gray, fontSize: 15, marginBottom: 20 }}>{text}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.blue }}>{totalScore}</div>
            <div style={{ fontSize: 12, color: COLORS.gray }}>Dina poäng</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.navy }}>{maxScore}</div>
            <div style={{ fontSize: 12, color: COLORS.gray }}>Max möjliga</div>
          </div>
          {avg !== null && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.accent }}>{avg}%</div>
              <div style={{ fontSize: 12, color: COLORS.gray }}>Snittet bland alla</div>
            </div>
          )}
        </div>
      </div>

      {board && (
        <div style={s.card}>
          <h3 style={{ color: COLORS.navy, marginTop: 0, marginBottom: 6, fontSize: 16 }}>
            📊 Jämförelse med andra spelare
          </h3>
          <p style={{ color: COLORS.gray, fontSize: 13, marginBottom: 18 }}>{board.length} spelare totalt · Genomsnitt: {avg}% · Median: {median}%</p>

          {beatPct !== null && (
            <div style={{ background: pct >= avg ? "#eafaf2" : "#fef5e7", border: `1px solid ${pct >= avg ? COLORS.green : COLORS.accent}`, borderRadius: 8, padding: "10px 14px", marginBottom: 18, fontSize: 14, color: COLORS.navyDark }}>
              {pct >= avg
                ? `🎉 Du slår ${beatPct}% av alla spelare!`
                : `Du är under snittet — ${100 - beatPct}% av spelarna gissade bättre.`}
            </div>
          )}

          <div style={{ fontSize: 13, color: COLORS.gray, marginBottom: 10 }}>Poängfördelning (din stapel i orange):</div>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 90, marginBottom: 6 }}>
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

          <h4 style={{ color: COLORS.navy, fontSize: 14, marginTop: 22, marginBottom: 10 }}>Topplistan (bästa 10)</h4>
          {board.slice(0, 10).map((entry, i) => {
            const isMe = i === myRankIndex;
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 12px", borderRadius: 6, marginBottom: 4, background: isMe ? "#fff8e1" : i % 2 === 0 ? COLORS.offWhite : COLORS.white, border: isMe ? `1px solid ${COLORS.accent}` : "1px solid transparent" }}>
                <span style={{ fontSize: 14, color: COLORS.navy }}>#{i + 1} {isMe ? <strong>← Du</strong> : "Spelare"}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.blue }}>{entry.score}%</span>
              </div>
            );
          })}
          {rank > 10 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 12px", borderRadius: 6, background: "#fff8e1", border: `1px solid ${COLORS.accent}`, marginTop: 4 }}>
              <span style={{ fontSize: 14, color: COLORS.navy }}>#{rank} <strong>← Du</strong></span>
              <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.blue }}>{pct}%</span>
            </div>
          )}
        </div>
      )}

      <div style={{ ...s.card, textAlign: "center" }}>
        <button style={s.btnAccent} onClick={() => window.location.reload()}>Spela igen 🔄</button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("start");
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState([]);
  const [lastGuess, setLastGuess] = useState(null);

  const q = QUESTIONS[qIndex];
  const totalScore = scores.reduce((a, b) => a + b, 0);
  const maxScore = QUESTIONS.length * 100;

  function handleSubmit(guess) {
    setLastGuess(guess);
    setScores([...scores, calcScore(guess, q.answer)]);
    setScreen("reveal");
  }

  function handleNext() {
    if (qIndex + 1 >= QUESTIONS.length) {
      setScreen("result");
    } else {
      setQIndex(qIndex + 1);
      setScreen("question");
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <div style={s.logo}>SIFO Gissaren</div>
          <div style={s.sub}>Hur väl känner du Sverige?</div>
        </div>
        {screen !== "start" && screen !== "result" && (
          <div style={{ marginLeft: "auto", background: COLORS.navyLight, borderRadius: 8, padding: "6px 14px", color: COLORS.white, fontSize: 14 }}>
            {totalScore} poäng
          </div>
        )}
      </div>
      <div style={{ padding: "8px 16px" }}>
        {screen === "start"    && <StartScreen onStart={() => setScreen("question")} total={QUESTIONS.length} />}
        {screen === "question" && <QuestionScreen question={q} qIndex={qIndex} total={QUESTIONS.length} onSubmit={handleSubmit} />}
        {screen === "reveal"   && <RevealScreen question={q} guess={lastGuess} score={scores[scores.length - 1]} onNext={handleNext} isLast={qIndex + 1 >= QUESTIONS.length} />}
        {screen === "result"   && <ResultScreen totalScore={totalScore} maxScore={maxScore} />}
      </div>
    </div>
  );
}

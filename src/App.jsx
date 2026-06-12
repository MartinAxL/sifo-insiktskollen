import { useState, useEffect } from "react";

// ============================================================
//  TRANSLATIONS
// ============================================================
const COLORS = {
  navy: "#1a2f4e", navyLight: "#243d63", navyDark: "#0f1e33",
  blue: "#2c6fad", blueLight: "#4a8fd4", accent: "#e8a020",
  white: "#ffffff", offWhite: "#f4f7fb", gray: "#8a9bb0",
  lightGray: "#d6e0ec", green: "#2ecc71", red: "#e74c3c",
};

const TRANSLATIONS = {
  sv: {
    appSubtitle: "Hur väl känner du Svenskarna?",
    profileTitle: "SIFO Insiktskollen",
    profileSubtitle: "Gissa hur Svenskarna svarar — jämför med verkligheten!",
    profileNameLabel: "Ditt namn / smeknamn",
    profileNamePlaceholder: "Vad ska vi kalla dig?",
    profileGenderLabel: "Kön",
    genders: ["Man", "Kvinna", "Annat"],
    profileAgeLabel: "Ålder",
    profileStartBtn: "Starta spelet 🇸🇪",
    profileFooter: (n) => `${n} frågor · Jämför med andra spelare · Tävla om pris`,
    questionLabel: (i, t) => `Fråga ${i} av ${t}`,
    questionPreamble: "Hur stor andel av Sveriges befolkning håller med om påståendet?",
    submitBtn: "Visa svaret →",
    revealTitle: "Rätt svar",
    yourGuess: "Din gissning",
    realAnswer: "Verkligt svar (SIFO)",
    missedBy: (d) => (
      <>Du missade med <strong style={{ color: d <= 5 ? COLORS.green : COLORS.red }}>{d} procentenheter</strong>.</>
    ),
    nextBtn: "Nästa fråga →",
    finalBtn: "Se ditt slutresultat 🏆",
    points: "poäng",
    resultTitle: (name) => `Bra jobbat, ${name}!`,
    yourScore: "Din poäng",
    allAvg: "Snittet bland alla",
    betterThan: "Bättre än",
    contactTitle: "📬 Håll kontakten",
    contactSubtitle: "Välj vad du är intresserad av — vi hör bara av oss om du bockar i något.",
    thankYou: (email) => <>✓ Tack! Vi hör av oss till <strong>{email}</strong>.</>,
    checkCompete: <><strong>🏆 Delta i tävlingen</strong> — vara med i utlottningen bland topplacerade spelare</>,
    checkReport: <><strong>📄 Få rapporten</strong> — ta emot den fullständiga SIFO-rapporten när den är klar (om 4–6 veckor)</>,
    checkContact: <><strong>💼 Bli kontaktad</strong> — om du är intresserad av att köpa en egen undersökning</>,
    emailLabel: "Din e-postadress",
    emailPlaceholder: "din@email.se",
    contactOptional: "Kontaktuppgifter",
    contactOptionalNote: "(valfritt)",
    contactOptionalSub: "Fyll i om du vill att vi ska kunna nå dig direkt.",
    nameField: "Namn",
    namePlaceholder: "Anna Andersson",
    companyField: "Företag",
    companyPlaceholder: "Företag AB",
    titleField: "Titel",
    titlePlaceholder: "VD, Chef, etc.",
    phoneField: "Telefon",
    phonePlaceholder: "070-000 00 00",
    sendBtn: (saving) => saving ? "Sparar…" : "Skicka",
    emailDisclaimer: "Din e-post används endast för de ändamål du valt ovan och delas inte vidare.",
    leaderboardTitle: "📊 Jämförelse med andra spelare",
    leaderboardSub: (n, avg, med) => `${n} spelare totalt · Genomsnitt: ${avg}% · Median: ${med}%`,
    beatsAll: (pct) => `🎉 Du slår ${pct}% av alla spelare!`,
    belowAvg: (pct) => `Du är under snittet — ${100 - pct}% av spelarna gissade bättre.`,
    distLabel: "Poängfördelning (din stapel i orange):",
    distBuckets: ["0–19%", "20–39%", "40–59%", "60–79%", "80–100%"],
    top10: "Topplistan (bästa 10)",
    youTag: "← Du",
    visitBtn: "Besök SIFO →",
    loadingBoard: "Laddar topplistan…",
    verdicts: [
      { min: 85, text: "Du är en SIFO-legend. Har du jobbat där?", emoji: "🏆" },
      { min: 65, text: "Riktigt bra! Du förstår den genomsnittliga svensken.", emoji: "🥈" },
      { min: 45, text: "Halvvägs dit. Du är minst lika förvirrad som Sverige.", emoji: "🤷" },
      { min: 0, text: "Är du säker på att du bor i Sverige?", emoji: "😅" },
    ],
    commentaries: [
      { max: 3, text: "Otroligt! Du är ett mänskligt SIFO-institut.", emoji: "🎯" },
      { max: 8, text: "Riktigt bra! Du har koll på svenska folksjälen.", emoji: "🔥" },
      { max: 15, text: "Hyfsad gissning — du är minst lika träffsäker som en meteorolog.", emoji: "🤔" },
      { max: 25, text: "Hmmm.. dags att mingla med lite fler människor?", emoji: "😬" },
      { max: Infinity, text: "Var bor du egentligen?", emoji: "😅" },
    ],
  },
  en: {
    appSubtitle: "How well do you know the Swedes?",
    profileTitle: "SIFO Insight Check",
    profileSubtitle: "Guess how Swedes answer — then compare with reality!",
    profileNameLabel: "Your name / nickname",
    profileNamePlaceholder: "What should we call you?",
    profileGenderLabel: "Gender",
    genders: ["Male", "Female", "Other"],
    profileAgeLabel: "Age",
    profileStartBtn: "Start the game 🇸🇪",
    profileFooter: (n) => `${n} questions · Compare with other players · Compete for prizes`,
    questionLabel: (i, tot) => `Question ${i} of ${tot}`,
    questionPreamble: "What share of Sweden's population agrees with this statement?",
    submitBtn: "Show the answer →",
    revealTitle: "Correct answer",
    yourGuess: "Your guess",
    realAnswer: "Real answer (SIFO)",
    missedBy: (d) => (
      <>You missed by <strong style={{ color: d <= 5 ? COLORS.green : COLORS.red }}>{d} percentage points</strong>.</>
    ),
    nextBtn: "Next question →",
    finalBtn: "See your final result 🏆",
    points: "points",
    resultTitle: (name) => `Well done, ${name}!`,
    yourScore: "Your score",
    allAvg: "Average of all",
    betterThan: "Better than",
    contactTitle: "📬 Stay in touch",
    contactSubtitle: "Choose what you're interested in — we'll only reach out if you check something.",
    thankYou: (email) => <>✓ Thanks! We'll be in touch at <strong>{email}</strong>.</>,
    checkCompete: <><strong>🏆 Enter the contest</strong> — be included in the draw among top-ranked players</>,
    checkReport: <><strong>📄 Get the report</strong> — receive the full SIFO report when it's ready (in 4–6 weeks)</>,
    checkContact: <><strong>💼 Get contacted</strong> — if you're interested in commissioning your own survey</>,
    emailLabel: "Your email address",
    emailPlaceholder: "you@email.com",
    contactOptional: "Contact details",
    contactOptionalNote: "(optional)",
    contactOptionalSub: "Fill in if you'd like us to reach you directly.",
    nameField: "Name",
    namePlaceholder: "Jane Smith",
    companyField: "Company",
    companyPlaceholder: "Acme Ltd",
    titleField: "Title",
    titlePlaceholder: "CEO, Manager, etc.",
    phoneField: "Phone",
    phonePlaceholder: "+46 70-000 00 00",
    sendBtn: (saving) => saving ? "Saving…" : "Submit",
    emailDisclaimer: "Your email is used only for the purposes you've selected and will not be shared.",
    leaderboardTitle: "📊 Compare with other players",
    leaderboardSub: (n, avg, med) => `${n} players total · Average: ${avg}% · Median: ${med}%`,
    beatsAll: (pct) => `🎉 You beat ${pct}% of all players!`,
    belowAvg: (pct) => `You're below average — ${100 - pct}% of players guessed better.`,
    distLabel: "Score distribution (your bar in orange):",
    distBuckets: ["0–19%", "20–39%", "40–59%", "60–79%", "80–100%"],
    top10: "Leaderboard (top 10)",
    youTag: "← You",
    visitBtn: "Visit SIFO →",
    loadingBoard: "Loading leaderboard…",
    verdicts: [
      { min: 85, text: "You're a SIFO legend. Have you worked there?", emoji: "🏆" },
      { min: 65, text: "Really good! You understand the average Swede.", emoji: "🥈" },
      { min: 45, text: "Halfway there. You're at least as confused as Sweden itself.", emoji: "🤷" },
      { min: 0, text: "Are you sure you live in Sweden?", emoji: "😅" },
    ],
    commentaries: [
      { max: 3, text: "Incredible! You're a human polling institute.", emoji: "🎯" },
      { max: 8, text: "Really good! You have a read on the Swedish pulse.", emoji: "🔥" },
      { max: 15, text: "Not bad — at least as accurate as a weather forecast.", emoji: "🤔" },
      { max: 25, text: "Hmm… time to mingle with a few more people?", emoji: "😬" },
      { max: Infinity, text: "Where do you actually live?", emoji: "😅" },
    ],
  },
};

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
        contact_name: payload.contact_name || null,
        company: payload.company || null,
        title: payload.title || null,
        phone: payload.phone || null,
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
  {
    sv: "Det är viktigt att Sverige har ett starkt militärt försvar.",
    en: "It is important that Sweden has a strong military defence.",
    answer: 86,
  },
  {
    sv: "Sverige bör införa Euro som valuta.",
    en: "Sweden should adopt the Euro as its currency.",
    answer: 24,
  },
  {
    sv: "Kriminaliteten i samhället oroar mig.",
    en: "Crime in society worries me.",
    answer: 88,
  },
  {
    sv: "Sverige bör ta emot fler flyktingar än idag.",
    en: "Sweden should accept more refugees than it does today.",
    answer: 23,
  },
  {
    sv: "Jag föredrar vegetarisk kost.",
    en: "I prefer a vegetarian diet.",
    answer: 19,
  },
  {
    sv: "Sverige bör lämna EU.",
    en: "Sweden should leave the EU.",
    answer: 15,
  },
  {
    sv: "Klimatförändringarna oroar mig.",
    en: "Climate change worries me.",
    answer: 71,
  },
  {
    sv: "Jag identifierar mig/känner samhörighet med HBTQI-rörelsen.",
    en: "I identify with / feel a sense of belonging to the LGBTQ+ movement.",
    answer: 14,
  },
  {
    sv: "Utbyggnad av svensk kärnkraft de kommande åren är nödvändig för ett stabilt och pålitligt energisystem i Sverige.",
    en: "Expanding Swedish nuclear power in the coming years is necessary for a stable and reliable energy system in Sweden.",
    answer: 55,
  },
  {
    sv: "Min religiösa tro är väldigt viktig för mig.",
    en: "My religious faith is very important to me.",
    answer: 17,
  },
];
// ============================================================

const calcScore = (guess, answer) => Math.max(0, Math.round(100 - Math.abs(guess - answer) * 3.5));
const calcFinalPct = (scores) => {
  if (!scores.length) return 0;
  return Math.min(100, Math.round(scores.reduce((a, b) => a + b, 0) / scores.length));
};

const s = {
  wrap: { fontFamily: "sans-serif", background: COLORS.offWhite, minHeight: "100vh", color: COLORS.navy },
  header: { background: COLORS.navy, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" },
  sub: { color: COLORS.gray, fontSize: 18, fontWeight: 500 },
  card: { background: COLORS.white, borderRadius: 14, padding: 28, margin: "20px auto", maxWidth: 660, boxShadow: "0 2px 12px rgba(26,47,78,0.08)" },
  btn: { background: COLORS.blue, color: COLORS.white, border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  btnAccent: { background: COLORS.accent, color: COLORS.navyDark, border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  tag: { display: "inline-block", background: COLORS.navyLight, color: COLORS.white, borderRadius: 20, padding: "3px 12px", fontSize: 12, marginBottom: 12 },
  input: { width: "100%", border: `1.5px solid ${COLORS.lightGray}`, borderRadius: 8, padding: "10px 14px", fontSize: 15, color: COLORS.navy, outline: "none", boxSizing: "border-box", background: COLORS.white },
};

// ============================================================
//  LANGUAGE TOGGLE BUTTON
// ============================================================
function LangToggle({ lang, setLang }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => setLang(lang === "sv" ? "en" : "sv")}
      title={lang === "sv" ? "Switch to English" : "Byt till svenska"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "transparent",
        border: `1.5px solid ${hovered ? COLORS.accent : COLORS.navyLight}`,
        borderRadius: 20,
        padding: "5px 14px",
        fontSize: 13,
        fontWeight: 600,
        color: hovered ? COLORS.accent : COLORS.gray,
        cursor: "pointer",
        letterSpacing: "0.03em",
        transition: "border-color 0.15s, color 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {lang === "sv" ? "🇬🇧 EN" : "🇸🇪 SV"}
    </button>
  );
}

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

function ProfileScreen({ onDone, t }) {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState(""); // stores canonical Swedish value: Man/Kvinna/Annat
  const [age, setAge] = useState("");
  const canProceed = nickname.trim() && gender && age;
  // Canonical gender values (always stored in Swedish for DB consistency)
  const canonicalGenders = ["Man", "Kvinna", "Annat"];
  return (
    <div style={{ ...s.card, maxWidth: 520 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 36, marginBottom: 6 }}>📊</div>
        <h1 style={{ color: COLORS.navy, fontSize: 22, margin: "0 0 6px", fontWeight: 700 }}>{t.profileTitle}</h1>
        <p style={{ color: COLORS.gray, fontSize: 14, margin: 0 }}>{t.profileSubtitle}</p>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 6 }}>{t.profileNameLabel}</label>
        <input style={s.input} placeholder={t.profileNamePlaceholder} value={nickname} maxLength={30} onChange={e => setNickname(e.target.value)} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 8 }}>{t.profileGenderLabel}</label>
        <div style={{ display: "flex", gap: 8 }}>
          {t.genders.map((label, i) => (
            <ToggleButton key={label} label={label} selected={gender === canonicalGenders[i]} onClick={() => setGender(canonicalGenders[i])} />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 8 }}>{t.profileAgeLabel}</label>
        <div style={{ display: "flex", gap: 8 }}>
          {["15-29", "30-49", "50-69", "70+"].map(a => (
            <ToggleButton key={a} label={a} selected={age === a} onClick={() => setAge(a)} />
          ))}
        </div>
      </div>
      <button
        style={{ ...s.btnAccent, width: "100%", opacity: canProceed ? 1 : 0.4 }}
        disabled={!canProceed}
        onClick={() => onDone({ nickname: nickname.trim(), gender, age_group: age })}
      >
        {t.profileStartBtn}
      </button>
      <p style={{ fontSize: 11, color: COLORS.gray, textAlign: "center", marginTop: 10 }}>
        {t.profileFooter(QUESTIONS.length)}
      </p>
    </div>
  );
}

function QuestionScreen({ question, qIndex, total, onSubmit, t, lang }) {
  const [guess, setGuess] = useState(50);
  return (
    <div style={s.card}>
      <span style={s.tag}>{t.questionLabel(qIndex + 1, total)}</span>
      <p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 6 }}>{t.questionPreamble}</p>
      <h2 style={{ color: COLORS.navy, fontSize: 22, margin: "0 0 32px", fontWeight: 700, lineHeight: 1.45, animation: "fadeIn 0.4s ease" }}>"{question[lang]}"</h2>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
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
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, marginBottom: 28 }}>
        {[0,10,20,30,40,50,60,70,80,90,100].map(v => (
          <span key={v} style={{ fontSize: 10, color: COLORS.lightGray }}>{v}</span>
        ))}
      </div>
      <button style={s.btn} onClick={() => onSubmit(guess)}>{t.submitBtn}</button>
    </div>
  );
}

function RevealScreen({ question, guess, score, onNext, isLast, t, lang }) {
  const diff = Math.abs(guess - question.answer);
  const commentary = t.commentaries.find(c => diff <= c.max) || t.commentaries[t.commentaries.length - 1];
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
        <h3 style={{ margin: 0, color: COLORS.navy, fontSize: 16 }}>{t.revealTitle}</h3>
        <div style={{ background: isGood ? COLORS.green : COLORS.red, color: COLORS.white, borderRadius: 20, padding: "4px 16px", fontWeight: 700, fontSize: 15 }}>
          {score} {t.points}
        </div>
      </div>
      <p style={{ fontSize: 15, fontStyle: "italic", marginBottom: 22, background: COLORS.offWhite, borderRadius: 8, padding: "12px 16px", lineHeight: 1.5 }}>
        {commentary.emoji} {commentary.text}
      </p>
      <Bar label={t.yourGuess} value={guess} color={COLORS.blueLight} />
      <Bar label={t.realAnswer} value={question.answer} color={COLORS.green} />
      <p style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>{t.missedBy(diff)}</p>
      <div style={{ marginTop: 24 }}>
        <button style={s.btn} onClick={onNext}>{isLast ? t.finalBtn : t.nextBtn}</button>
      </div>
    </div>
  );
}

function Checkbox({ id, checked, onChange, children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
      <input
        type="checkbox" id={id} checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ marginTop: 3, accentColor: COLORS.blue, width: 17, height: 17, cursor: "pointer", flexShrink: 0 }}
      />
      <label htmlFor={id} style={{ fontSize: 14, color: COLORS.navyDark, cursor: "pointer", lineHeight: 1.5 }}>{children}</label>
    </div>
  );
}

function ResultScreen({ scores, profile, guesses, t }) {
  const [board, setBoard] = useState(null);
  const [email, setEmail] = useState("");
  const [wantCompete, setWantCompete] = useState(false);
  const [wantReport, setWantReport] = useState(false);
  const [wantContact, setWantContact] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contactName, setContactName] = useState("");
  const [company, setCompany] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [phone, setPhone] = useState("");

  const pct = calcFinalPct(scores);
  const needsEmail = wantCompete || wantReport || wantContact;

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
    }).then(() => {
      getLeaderboard().then(data => setBoard(Array.isArray(data) ? data : []));
    });
  }, []);

  async function handleEmailSubmit() {
    if (!email.trim()) return;
    setSaving(true);
    const payload = {
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
    };
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
        method: "POST",
        headers: { ...dbHeaders, "Prefer": "return=minimal" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error("Save failed:", e);
    }
    setSaving(false);
    setSubmitted(true);
  }

  const verdict = t.verdicts.find(v => pct >= v.min) || t.verdicts[t.verdicts.length - 1];

  const deduped = board ? Object.values(
    board.reduce((acc, e) => {
      const key = e.nickname.toLowerCase().trim();
      if (!acc[key] || e.score > acc[key].score) acc[key] = e;
      return acc;
    }, {})
  ) : [];
  const sorted = deduped.sort((a, b) => b.score - a.score);
  const avg = sorted.length ? Math.round(sorted.reduce((a, b) => a + b.score, 0) / sorted.length) : null;
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)]?.score : null;
  const myRankIndex = sorted.findIndex(e => e.nickname === profile.nickname && e.score === pct);
  const rank = myRankIndex + 1;
  const beatPct = sorted.length > 1
    ? Math.min(100, Math.max(0, Math.round((sorted.filter(e => e.score < pct).length / sorted.length) * 100)))
    : null;

  const distBuckets = sorted.length ? (() => {
    const b = [0, 0, 0, 0, 0];
    sorted.forEach(e => { b[Math.min(4, Math.floor(e.score / 20))]++; });
    return b;
  })() : null;
  const maxBucket = distBuckets ? Math.max(...distBuckets, 1) : 1;
  const myBucket = Math.min(4, Math.floor(pct / 20));

  return (
    <div style={{ maxWidth: 660, margin: "0 auto" }}>
      <div style={{ ...s.card, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{verdict.emoji}</div>
        <h2 style={{ color: COLORS.navy, fontSize: 24, margin: "0 0 4px" }}>{t.resultTitle(profile.nickname)}</h2>
        <p style={{ color: COLORS.gray, fontSize: 15, marginBottom: 4 }}>{t.yourScore}: <strong style={{ color: COLORS.blue }}>{pct}%</strong></p>
        <p style={{ color: COLORS.gray, fontSize: 14, marginBottom: 20 }}>{verdict.text}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.blue }}>{pct}%</div>
            <div style={{ fontSize: 12, color: COLORS.gray }}>{t.yourScore}</div>
          </div>
          {avg !== null && (
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.accent }}>{avg}%</div>
              <div style={{ fontSize: 12, color: COLORS.gray }}>{t.allAvg}</div>
            </div>
          )}
          {beatPct !== null && (
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.green }}>{beatPct}%</div>
              <div style={{ fontSize: 12, color: COLORS.gray }}>{t.betterThan}</div>
            </div>
          )}
        </div>
      </div>

      <div style={s.card}>
        <h3 style={{ color: COLORS.navy, marginTop: 0, marginBottom: 6, fontSize: 16 }}>{t.contactTitle}</h3>
        <p style={{ color: COLORS.gray, fontSize: 13, marginBottom: 18 }}>{t.contactSubtitle}</p>
        {submitted ? (
          <div style={{ background: "#eafaf2", border: `1px solid ${COLORS.green}`, borderRadius: 8, padding: "14px 16px", fontSize: 14, color: "#1e8449" }}>
            {t.thankYou(email)}
          </div>
        ) : (
          <>
            <Checkbox id="compete" checked={wantCompete} onChange={setWantCompete}>{t.checkCompete}</Checkbox>
            <Checkbox id="report" checked={wantReport} onChange={setWantReport}>{t.checkReport}</Checkbox>
            <Checkbox id="contact" checked={wantContact} onChange={setWantContact}>{t.checkContact}</Checkbox>
            {needsEmail && (
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 6 }}>{t.emailLabel}</label>
                <input
                  style={{ ...s.input, marginBottom: 14 }}
                  type="email" placeholder={t.emailPlaceholder}
                  value={email} onChange={e => setEmail(e.target.value)}
                />
                {wantContact && (
                  <div style={{ background: COLORS.offWhite, borderRadius: 10, padding: "16px", marginBottom: 14 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, margin: "0 0 4px" }}>
                      {t.contactOptional} <span style={{ fontWeight: 400, color: COLORS.gray }}>{t.contactOptionalNote}</span>
                    </p>
                    <p style={{ fontSize: 12, color: COLORS.gray, margin: "0 0 14px" }}>{t.contactOptionalSub}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[
                        [t.nameField, t.namePlaceholder, contactName, setContactName],
                        [t.companyField, t.companyPlaceholder, company, setCompany],
                        [t.titleField, t.titlePlaceholder, contactTitle, setContactTitle],
                        [t.phoneField, t.phonePlaceholder, phone, setPhone],
                      ].map(([label, placeholder, val, setter]) => (
                        <div key={label}>
                          <label style={{ fontSize: 12, color: COLORS.gray, display: "block", marginBottom: 4 }}>{label}</label>
                          <input
                            style={{ ...s.input, fontSize: 14, padding: "8px 12px" }}
                            placeholder={placeholder} value={val}
                            onChange={e => setter(e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  style={{ ...s.btn, width: "100%", opacity: !email.trim() || saving ? 0.4 : 1 }}
                  disabled={!email.trim() || saving}
                  onClick={handleEmailSubmit}
                >{t.sendBtn(saving)}</button>
                <p style={{ fontSize: 11, color: COLORS.gray, marginTop: 8 }}>{t.emailDisclaimer}</p>
              </div>
            )}
          </>
        )}
      </div>

      {!board && (
        <div style={{ ...s.card, textAlign: "center", color: COLORS.gray }}>{t.loadingBoard}</div>
      )}

      {board && sorted.length > 0 && (
        <div style={s.card}>
          <h3 style={{ color: COLORS.navy, marginTop: 0, marginBottom: 6, fontSize: 16 }}>{t.leaderboardTitle}</h3>
          <p style={{ color: COLORS.gray, fontSize: 13, marginBottom: 18 }}>{t.leaderboardSub(sorted.length, avg, median)}</p>
          {beatPct !== null && (
            <div style={{
              background: pct >= avg ? "#eafaf2" : "#fef5e7",
              border: `1px solid ${pct >= avg ? COLORS.green : COLORS.accent}`,
              borderRadius: 8, padding: "10px 14px", marginBottom: 18, fontSize: 14, color: COLORS.navyDark,
            }}>
              {pct >= avg ? t.beatsAll(beatPct) : t.belowAvg(beatPct)}
            </div>
          )}
          <div style={{ fontSize: 13, color: COLORS.gray, marginBottom: 10 }}>{t.distLabel}</div>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 90, marginBottom: 16 }}>
            {distBuckets.map((count, i) => {
              const barH = Math.max(4, Math.round((count / maxBucket) * 74));
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ fontSize: 11, color: COLORS.gray }}>{count}</div>
                  <div style={{ width: "100%", height: barH, background: myBucket === i ? COLORS.accent : COLORS.blue, borderRadius: "4px 4px 0 0", opacity: 0.85 }} />
                  <div style={{ fontSize: 10, color: myBucket === i ? COLORS.accent : COLORS.gray, fontWeight: myBucket === i ? 700 : 400, textAlign: "center", lineHeight: 1.3 }}>
                    {t.distBuckets[i]}
                  </div>
                </div>
              );
            })}
          </div>
          <h4 style={{ color: COLORS.navy, fontSize: 14, marginBottom: 10 }}>{t.top10}</h4>
          {sorted.slice(0, 10).map((entry, i) => {
            const isMe = i === myRankIndex;
            return (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", padding: "7px 12px", borderRadius: 6, marginBottom: 4,
                background: isMe ? "#fff8e1" : i % 2 === 0 ? COLORS.offWhite : COLORS.white,
                border: isMe ? `1px solid ${COLORS.accent}` : "1px solid transparent",
              }}>
                <span style={{ fontSize: 14, color: COLORS.navy }}>
                  #{i + 1} {entry.nickname} {entry.email ? "✉" : ""} {isMe && <strong>{t.youTag}</strong>}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.blue }}>{entry.score}%</span>
              </div>
            );
          })}
          {rank > 10 && (
            <div style={{
              display: "flex", justifyContent: "space-between", padding: "7px 12px", borderRadius: 6,
              background: "#fff8e1", border: `1px solid ${COLORS.accent}`, marginTop: 4,
            }}>
              <span style={{ fontSize: 14, color: COLORS.navy }}>#{rank} {profile.nickname} <strong>{t.youTag}</strong></span>
              <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.blue }}>{pct}%</span>
            </div>
          )}
        </div>
      )}

      <div style={{ ...s.card, textAlign: "center" }}>
        <a href="https://www.fifty5blue.com/se" style={{ ...s.btnAccent, display: "inline-block", textDecoration: "none" }}>
          {t.visitBtn}
        </a>
      </div>
    </div>
  );
}

// ============================================================
//  APP ROOT
// ============================================================
export default function App() {
  const [lang, setLang] = useState("sv"); // "sv" | "en"
  const t = TRANSLATIONS[lang];

  const [screen, setScreen] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [lastGuess, setLastGuess] = useState(null);

  const q = QUESTIONS[qIndex];
  const totalScore = scores.reduce((a, b) => a + b, 0);

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
        <div style={s.sub}>{t.appSubtitle}</div>
        {(screen === "question" || screen === "reveal") && profile && (
          <div style={{ background: COLORS.navyLight, borderRadius: 8, padding: "6px 14px", color: COLORS.white, fontSize: 14 }}>
            {profile.nickname} · {totalScore} p
          </div>
        )}
        <LangToggle lang={lang} setLang={setLang} />
      </div>
      <div style={{ padding: "8px 16px" }}>
        {screen === "profile"  && <ProfileScreen onDone={handleProfileDone} t={t} />}
        {screen === "question" && <QuestionScreen question={q} qIndex={qIndex} total={QUESTIONS.length} onSubmit={handleSubmit} t={t} lang={lang} />}
        {screen === "reveal"   && <RevealScreen question={q} guess={lastGuess} score={scores[scores.length - 1]} onNext={handleNext} isLast={qIndex + 1 >= QUESTIONS.length} t={t} lang={lang} />}
        {screen === "result"   && <ResultScreen scores={scores} profile={profile} guesses={guesses} t={t} />}
      </div>
    </div>
  );
}

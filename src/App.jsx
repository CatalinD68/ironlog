import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { supabase } from "./supabase.js";

/* ═══════════════════════════════════════════════════
   DESIGN SYSTEM — Black / White / Red Minimalist
   ═══════════════════════════════════════════════════ */
const DS = {
  colors: {
    black: "#0A0A0A", blackLight: "#141414", blackMid: "#1E1E1E", blackSoft: "#2A2A2A",
    gray: "#6B6B6B", grayLight: "#999999", grayBorder: "#333333",
    white: "#F5F5F5", whitePure: "#FFFFFF",
    red: "#E53935", redDark: "#C62828",
    redGlow: "rgba(229, 57, 53, 0.15)", redGlowStrong: "rgba(229, 57, 53, 0.3)",
  },
  r: { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 },
  font: "'Archivo Black', 'Arial Black', sans-serif",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
};

/* ═══════ ICONS ═══════ */
const Icon = ({ name, size = 20, color = DS.colors.white }) => {
  const s = { width: size, height: size };
  const p = { fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    dumbbell: <svg {...s} viewBox="0 0 24 24" {...p}><path d="M6.5 6.5a2 2 0 0 0-3 0L2 8a2 2 0 0 0 0 3l1 1a2 2 0 0 0 3 0"/><path d="M17.5 17.5a2 2 0 0 0 3 0L22 16a2 2 0 0 0 0-3l-1-1a2 2 0 0 0-3 0"/><path d="M8.5 8.5 15.5 15.5"/><path d="M5.5 11.5 12.5 18.5"/><path d="M11.5 5.5 18.5 12.5"/></svg>,
    plus: <svg {...s} viewBox="0 0 24 24" {...p} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    calendar: <svg {...s} viewBox="0 0 24 24" {...p}><rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    timer: <svg {...s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M10 2h4"/><path d="M12 2v2"/></svg>,
    note: <svg {...s} viewBox="0 0 24 24" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
    chevLeft: <svg {...s} viewBox="0 0 24 24" {...p}><polyline points="15 18 9 12 15 6"/></svg>,
    chevRight: <svg {...s} viewBox="0 0 24 24" {...p}><polyline points="9 18 15 12 9 6"/></svg>,
    chevDown: <svg {...s} viewBox="0 0 24 24" {...p}><polyline points="6 9 12 15 18 9"/></svg>,
    play: <svg {...s} viewBox="0 0 24 24" fill={color} stroke="none"><polygon points="6,3 20,12 6,21"/></svg>,
    pause: <svg {...s} viewBox="0 0 24 24" fill={color} stroke="none"><rect x="5" y="3" width="5" height="18" rx="1"/><rect x="14" y="3" width="5" height="18" rx="1"/></svg>,
    reset: <svg {...s} viewBox="0 0 24 24" {...p}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
    trash: <svg {...s} viewBox="0 0 24 24" {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    logout: <svg {...s} viewBox="0 0 24 24" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    fire: <svg {...s} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M12 23c-4.97 0-8-3.58-8-7.5 0-3.07 2.17-5.64 3.5-7l1.5 2c.67-1.5 1.5-3.5 1.5-5.5 0-.56-.06-1.12-.17-1.67C11.44 2.78 12.56 2 14 2c0 2.5 1.5 4.5 3 6.5s3 4.06 3 6C20 19.42 16.97 23 12 23z"/></svg>,
    check: <svg {...s} viewBox="0 0 24 24" {...p} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
    copy: <svg {...s} viewBox="0 0 24 24" {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
    chart: <svg {...s} viewBox="0 0 24 24" {...p}><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
    list: <svg {...s} viewBox="0 0 24 24" {...p}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    x: <svg {...s} viewBox="0 0 24 24" {...p} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    sun: <svg {...s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    target: <svg {...s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    trendUp: <svg {...s} viewBox="0 0 24 24" {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    video: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="15" height="16" rx="2"/><path d="M17 10l5-3v10l-5-3"/></svg>,
    youtube: <svg {...s} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.9 31.9 0 0 0 24 12a31.9 31.9 0 0 0-.5-5.8zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z"/></svg>,
    link: <svg {...s} viewBox="0 0 24 24" {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  };
  return icons[name] || null;
};

/* ═══════ EXERCISE LIST ═══════ */
const EXERCISES = [
  "Bench Press","Incline Bench Press","Decline Bench Press","Dumbbell Fly",
  "Squat","Front Squat","Leg Press","Leg Extension","Leg Curl","Calf Raise",
  "Deadlift","Romanian Deadlift","Sumo Deadlift",
  "Overhead Press","Lateral Raise","Front Raise","Face Pull",
  "Barbell Row","Dumbbell Row","Lat Pulldown","Pull Up","Chin Up","Cable Row",
  "Bicep Curl","Hammer Curl","Preacher Curl",
  "Tricep Pushdown","Skull Crusher","Tricep Dip",
  "Plank","Crunch","Russian Twist","Hanging Leg Raise",
  "Hip Thrust","Bulgarian Split Squat","Lunge","Walking Lunge",
];

/* ═══════ DATE HELPERS ═══════ */
const dk = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const todayKey = () => dk(new Date());
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAYS_MIN = ["M","T","W","T","F","S","S"];
function parseDate(str) { const [y,m,d] = str.split("-").map(Number); return new Date(y, m-1, d); }

function getWeekDates(d) {
  const date = new Date(d), day = date.getDay(), diff = day === 0 ? 6 : day - 1;
  const mon = new Date(date); mon.setDate(date.getDate() - diff);
  return Array.from({ length: 7 }, (_, i) => { const dd = new Date(mon); dd.setDate(mon.getDate() + i); return dd; });
}
function getMonthDates(year, month) {
  const lastDay = new Date(year, month + 1, 0).getDate();
  let startDay = new Date(year, month, 1).getDay(); startDay = startDay === 0 ? 6 : startDay - 1;
  const dates = [];
  for (let i = 0; i < startDay; i++) dates.push({ date: new Date(year, month, -startDay + i + 1), inMonth: false });
  for (let i = 1; i <= lastDay; i++) dates.push({ date: new Date(year, month, i), inMonth: true });
  while (dates.length < 42) { const n = dates.length - startDay - lastDay + 1; dates.push({ date: new Date(year, month + 1, n), inMonth: false }); }
  return dates;
}

/* ═══════ SHARED STYLES ═══════ */
const labelSt = { fontSize: 11, color: DS.colors.grayLight, letterSpacing: 1, marginBottom: 8, display: "block", fontWeight: 600 };
const cardSt = { background: DS.colors.blackLight, borderRadius: DS.r.lg, border: `1px solid ${DS.colors.grayBorder}` };
const inpSt = { width: "100%", padding: "12px 14px", background: DS.colors.blackMid, border: `1px solid ${DS.colors.grayBorder}`, borderRadius: DS.r.md, color: DS.colors.white, fontSize: 14, outline: "none", fontFamily: DS.body };
const setInpSt = { padding: "8px", background: DS.colors.blackMid, border: `1px solid ${DS.colors.grayBorder}`, borderRadius: DS.r.sm, color: DS.colors.white, fontSize: 13, outline: "none", textAlign: "center", height: 36, width: "100%", fontFamily: DS.body };
const numBtnSt = { width: 34, height: 34, borderRadius: DS.r.full, background: DS.colors.blackMid, border: `1px solid ${DS.colors.grayBorder}`, color: DS.colors.white, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const navBtnSt = { background: DS.colors.blackLight, border: `1px solid ${DS.colors.grayBorder}`, borderRadius: DS.r.full, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
const fmtTime = (ms) => { const m=Math.floor(ms/60000),s=Math.floor((ms%60000)/1000),c=Math.floor((ms%1000)/10); return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(c).padStart(2,"0")}`; };

/* ═══════ VIDEO BUTTON — opens YouTube link ═══════ */
function VideoBtn({ url, size = 18 }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} title="Watch video" style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: size + 8, height: size + 8, borderRadius: DS.r.sm,
      background: "rgba(255,0,0,0.12)", border: "none", cursor: "pointer",
      textDecoration: "none", flexShrink: 0, transition: "all 0.15s",
    }}>
      <Icon name="youtube" size={size} color="#FF0000" />
    </a>
  );
}

/* ═══════ Exercise name + video btn inline ═══════ */
function ExName({ name, videoUrl, size = 13, bold = true, color = DS.colors.whitePure }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: size, fontWeight: bold ? 600 : 400, color }}>{name}</span>
      <VideoBtn url={videoUrl} size={14} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUPABASE DATA HOOK
   ═══════════════════════════════════════════════════ */
function useSupabaseData(userId) {
  const [workouts, setWorkouts] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [wRes, nRes] = await Promise.all([
        supabase.from("workouts").select("*").eq("user_id", userId),
        supabase.from("notes").select("*").eq("user_id", userId),
      ]);
      const wMap = {};
      (wRes.data || []).forEach(row => {
        if (!wMap[row.date]) wMap[row.date] = [];
        wMap[row.date].push({ id: row.id, ...row.data });
      });
      setWorkouts(wMap);
      const nMap = {};
      (nRes.data || []).forEach(row => { nMap[row.date] = row.text; });
      setNotes(nMap);
    } catch (e) { console.error("Load error:", e); }
    setLoading(false);
  }, [userId]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const addWorkout = async (date, workout) => {
    const { data, error } = await supabase.from("workouts").insert({
      user_id: userId, date, data: { name: workout.name, exercises: workout.exercises },
    }).select().single();
    if (!error && data) {
      setWorkouts(p => ({ ...p, [date]: [...(p[date]||[]), { id: data.id, name: workout.name, exercises: workout.exercises }] }));
    }
  };

  const delWorkout = async (date, workoutId) => {
    await supabase.from("workouts").delete().eq("id", workoutId);
    setWorkouts(p => {
      const f = (p[date]||[]).filter(w => w.id !== workoutId);
      const n = { ...p }; if (!f.length) delete n[date]; else n[date] = f; return n;
    });
  };

  const saveNote = async (date, text) => {
    if (!text.trim()) {
      await supabase.from("notes").delete().eq("user_id", userId).eq("date", date);
      setNotes(p => { const n = { ...p }; delete n[date]; return n; });
    } else {
      await supabase.from("notes").upsert({ user_id: userId, date, text }, { onConflict: "user_id,date" });
      setNotes(p => ({ ...p, [date]: text }));
    }
  };

  return { workouts, notes, loading, addWorkout, delWorkout, saveNote };
}

/* ═══════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════ */
export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState("today");
  const [showAdd, setShowAdd] = useState(false);
  const [template, setTemplate] = useState(null);
  const [addDate, setAddDate] = useState(todayKey());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => { setSession(session); });
    return () => subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;
  const userName = (session?.user?.email || "").split("@")[0];
  const { workouts, notes, loading, addWorkout, delWorkout, saveNote } = useSupabaseData(userId);

  const templates = useMemo(() => {
    const seen = new Set(), arr = [];
    Object.entries(workouts).sort(([a],[b]) => b.localeCompare(a)).forEach(([,ws]) => ws.forEach(w => { if (!seen.has(w.name)) { seen.add(w.name); arr.push(w); } }));
    return arr;
  }, [workouts]);

  // Build a map of exercise name → most recent YouTube URL
  const videoMap = useMemo(() => {
    const map = {};
    Object.entries(workouts).sort(([a],[b]) => a.localeCompare(b)).forEach(([,ws]) =>
      ws.forEach(w => w.exercises?.forEach(e => { if (e.videoUrl) map[e.name] = e.videoUrl; }))
    );
    return map;
  }, [workouts]);

  const reuse = (w) => {
    setTemplate({ name: w.name, exercises: w.exercises.map(e => ({ name: e.name, sets: e.sets.map(s => ({ ...s })), videoUrl: e.videoUrl || "" })) });
    setAddDate(todayKey()); setShowAdd(true);
  };

  if (authLoading || (session && loading)) return <LoadingScreen />;
  if (!session) return <AuthScreen />;

  return (
    <div style={{ minHeight: "100dvh", background: DS.colors.black, fontFamily: DS.body, color: DS.colors.white, maxWidth: 480, margin: "0 auto", position: "relative", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${DS.colors.blackSoft}; border-radius: 4px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        input::placeholder, textarea::placeholder { color: ${DS.colors.gray}; }
      `}</style>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        {tab === "today" && <TodayTab workouts={workouts} notes={notes} userName={userName} onLogout={() => supabase.auth.signOut()} onAdd={() => { setTemplate(null); setAddDate(todayKey()); setShowAdd(true); }} onReuse={reuse} templates={templates} onSaveNote={saveNote} />}
        {tab === "analytics" && <AnalyticsTab workouts={workouts} onAdd={() => { setTemplate(null); setAddDate(todayKey()); setShowAdd(true); }} onReuse={reuse} templates={templates} />}
        {tab === "workouts" && <WorkoutsTab workouts={workouts} notes={notes} onDelete={delWorkout} onReuse={reuse} />}
        {tab === "planning" && <PlanningTab workouts={workouts} notes={notes} onAdd={(date) => { setTemplate(null); setAddDate(date); setShowAdd(true); }} onDelete={delWorkout} onSaveNote={saveNote} />}
      </div>
      <BottomNav tab={tab} setTab={setTab} />
      {showAdd && <AddWorkoutOverlay date={addDate} setDate={setAddDate} template={template} onAdd={addWorkout} onClose={() => { setShowAdd(false); setTemplate(null); }} videoMap={videoMap} />}
    </div>
  );
}

/* ═══════ LOADING ═══════ */
function LoadingScreen() {
  return <div style={{ minHeight: "100vh", background: DS.colors.black, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
    <div style={{ animation: "pulse 1.5s infinite" }}><Icon name="fire" size={48} color={DS.colors.red} /></div>
    <span style={{ fontFamily: DS.font, color: DS.colors.grayLight, fontSize: 14, letterSpacing: 3 }}>LOADING</span>
  </div>;
}

/* ═══════ AUTH SCREEN (real Supabase signup/login) ═══════ */
function AuthScreen() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");

  const go = async () => {
    if (!email.trim() || !pass.trim()) { setErr("Fill in all fields"); return; }
    if (pass.length < 6) { setErr("Password must be 6+ characters"); return; }
    setLoading(true); setErr("");
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email: email.trim(), password: pass });
        if (error) { setErr(error.message); }
        else { setConfirmMsg("Check your email to confirm your account, then log in!"); }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
        if (error) setErr(error.message);
      }
    } catch (e) { setErr(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: DS.colors.black, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: DS.body, color: DS.colors.white }}>
      <div style={{ width: "100%", maxWidth: 380, animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 72, height: 72, borderRadius: DS.r.xl, background: DS.colors.red, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: `0 0 40px ${DS.colors.redGlowStrong}` }}><Icon name="fire" size={36} color={DS.colors.whitePure} /></div>
          <h1 style={{ fontFamily: DS.font, fontSize: 28, letterSpacing: 2, color: DS.colors.whitePure, marginBottom: 6 }}>IRONLOG</h1>
          <p style={{ color: DS.colors.gray, fontSize: 13, letterSpacing: 1 }}>TRACK · TRAIN · TRANSFORM</p>
        </div>
        {confirmMsg ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ ...cardSt, padding: 20, marginBottom: 16 }}>
              <Icon name="check" size={28} color={DS.colors.red} />
              <p style={{ color: DS.colors.grayLight, fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>{confirmMsg}</p>
            </div>
            <button onClick={() => { setConfirmMsg(""); setIsSignUp(false); }} style={{ background: DS.colors.red, border: "none", borderRadius: DS.r.md, color: DS.colors.whitePure, padding: "14px 32px", fontFamily: DS.font, letterSpacing: 2, fontSize: 13, cursor: "pointer" }}>GO TO LOGIN</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={labelSt}>EMAIL</label><input value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} placeholder="you@email.com" style={inpSt} onKeyDown={e=>e.key==="Enter"&&go()} /></div>
            <div><label style={labelSt}>PASSWORD</label><input type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr("");}} placeholder="Min 6 characters" style={inpSt} onKeyDown={e=>e.key==="Enter"&&go()} /></div>
            {err && <p style={{ color: DS.colors.red, fontSize: 13, textAlign: "center" }}>{err}</p>}
            <button onClick={go} disabled={loading} style={{ width: "100%", padding: 15, marginTop: 4, background: loading ? DS.colors.blackSoft : DS.colors.red, border: "none", borderRadius: DS.r.md, color: DS.colors.whitePure, fontSize: 14, fontFamily: DS.font, letterSpacing: 2, cursor: loading ? "wait" : "pointer", boxShadow: `0 4px 20px ${DS.colors.redGlow}` }}>
              {loading ? "..." : isSignUp ? "SIGN UP" : "LOG IN"}
            </button>
            <button onClick={() => { setIsSignUp(!isSignUp); setErr(""); }} style={{ background: "none", border: "none", color: DS.colors.grayLight, fontSize: 13, cursor: "pointer", textAlign: "center", padding: 8 }}>
              {isSignUp ? "Already have an account? Log in" : "No account? Sign up"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════ BOTTOM NAV ═══════ */
function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: "today", icon: "sun", label: "Today" },
    { id: "analytics", icon: "chart", label: "Stats" },
    { id: "workouts", icon: "list", label: "Log" },
    { id: "planning", icon: "calendar", label: "Plan" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: `linear-gradient(to top, ${DS.colors.black} 70%, transparent)`, padding: "12px 8px 10px", zIndex: 90 }}>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", background: DS.colors.blackLight, borderRadius: DS.r.xl, border: `1px solid ${DS.colors.grayBorder}`, padding: "6px 4px", backdropFilter: "blur(20px)" }}>
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: active ? DS.colors.redGlow : "transparent", border: "none", borderRadius: DS.r.lg, padding: "8px 4px", cursor: "pointer", transition: "all 0.2s" }}>
              <Icon name={t.icon} size={20} color={active ? DS.colors.red : DS.colors.gray} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.8, color: active ? DS.colors.red : DS.colors.gray }}>{t.label.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 1 — TODAY (with inline stopwatch)
   ═══════════════════════════════════════════════════ */
function TodayTab({ workouts, notes, userName, onLogout, onAdd, onReuse, templates, onSaveNote }) {
  const t = todayKey();
  const tw = workouts[t] || [];
  const [noteText, setNoteText] = useState(notes[t] || "");
  const [noteSaved, setNoteSaved] = useState(false);
  useEffect(() => { setNoteText(notes[t] || ""); }, [notes, t]);
  const handleSaveNote = () => { onSaveNote(t, noteText); setNoteSaved(true); setTimeout(() => setNoteSaved(false), 2000); };

  let streak = 0; const d = new Date();
  while (workouts[dk(d)]?.length > 0) { streak++; d.setDate(d.getDate() - 1); }

  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <div style={{ padding: "20px 20px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <p style={{ fontSize: 12, color: DS.colors.grayLight, letterSpacing: 1, marginBottom: 2 }}>{dayName.toUpperCase()}</p>
          <h1 style={{ fontFamily: DS.font, fontSize: 24, color: DS.colors.whitePure, marginBottom: 2 }}>{dateStr}</h1>
          <p style={{ fontSize: 13, color: DS.colors.gray }}>Hey, {userName}</p>
        </div>
        <button onClick={onLogout} style={{ background: DS.colors.blackMid, border: `1px solid ${DS.colors.grayBorder}`, borderRadius: DS.r.full, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: 4 }}><Icon name="logout" size={16} color={DS.colors.grayLight} /></button>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div style={{ ...cardSt, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, animation: "fadeUp 0.35s ease" }}>
          <div style={{ width: 40, height: 40, borderRadius: DS.r.md, background: DS.colors.redGlow, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="fire" size={22} color={DS.colors.red} /></div>
          <div>
            <div style={{ fontFamily: DS.font, fontSize: 20, color: DS.colors.red }}>{streak} day streak</div>
            <div style={{ fontSize: 11, color: DS.colors.gray }}>Keep going!</div>
          </div>
        </div>
      )}

      {/* Today's Workouts */}
      <div style={{ marginBottom: 20, animation: "fadeUp 0.4s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ ...labelSt, marginBottom: 0 }}>TODAY'S WORKOUTS</span>
          <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: 4, background: DS.colors.red, border: "none", borderRadius: DS.r.full, padding: "6px 14px 6px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, color: DS.colors.whitePure, letterSpacing: 0.5 }}>
            <Icon name="plus" size={14} color={DS.colors.whitePure} /> ADD
          </button>
        </div>
        {tw.length === 0 ? (
          <div style={{ ...cardSt, padding: "32px 20px", textAlign: "center" }}>
            <Icon name="dumbbell" size={32} color={DS.colors.grayBorder} />
            <p style={{ color: DS.colors.gray, fontSize: 13, marginTop: 12 }}>No workout logged yet today</p>
            <button onClick={onAdd} style={{ marginTop: 14, padding: "10px 24px", background: DS.colors.red, border: "none", borderRadius: DS.r.md, color: DS.colors.whitePure, fontSize: 12, fontFamily: DS.font, letterSpacing: 1, cursor: "pointer" }}>LOG WORKOUT</button>
          </div>
        ) : tw.map(w => (
          <div key={w.id} style={{ ...cardSt, padding: "14px 16px", marginBottom: 8 }}>
            <div style={{ fontFamily: DS.font, fontSize: 14, color: DS.colors.red, marginBottom: 10 }}>{w.name}</div>
            {w.exercises?.map((ex, j) => (
              <div key={j} style={{ marginBottom: j < w.exercises.length - 1 ? 8 : 0 }}>
                <ExName name={ex.name} videoUrl={ex.videoUrl} size={13} />
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                  {ex.sets.map((s, si) => (
                    <span key={si} style={{ fontSize: 11, padding: "3px 8px", borderRadius: DS.r.sm, background: DS.colors.blackMid, color: DS.colors.grayLight }}>
                      <span style={{ color: DS.colors.red, fontWeight: 600 }}>{s.reps}</span>×<span style={{ color: DS.colors.whitePure, fontWeight: 600 }}>{s.kgs}</span>kg
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Quick reuse */}
      {templates.length > 0 && tw.length === 0 && (
        <div style={{ marginBottom: 20, animation: "fadeUp 0.45s ease" }}>
          <span style={labelSt}>QUICK START</span>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {templates.slice(0, 4).map((w, i) => (
              <button key={i} onClick={() => onReuse(w)} style={{ flexShrink: 0, padding: "12px 16px", ...cardSt, cursor: "pointer", textAlign: "left", minWidth: 140, transition: "all 0.15s" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: DS.colors.whitePure, marginBottom: 4 }}>{w.name}</div>
                <div style={{ fontSize: 10, color: DS.colors.gray }}>{w.exercises?.length} exercise{w.exercises?.length !== 1 ? "s" : ""}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ────── INLINE STOPWATCH ────── */}
      <InlineStopwatch />

      {/* Today's Note */}
      <div style={{ animation: "fadeUp 0.55s ease" }}>
        <span style={labelSt}>TODAY'S NOTE</span>
        <textarea value={noteText} onChange={e => { setNoteText(e.target.value); setNoteSaved(false); }} placeholder="How are you feeling? Goals for today..." rows={4} style={{ ...inpSt, resize: "vertical", lineHeight: 1.7, minHeight: 100 }} />
        <button onClick={handleSaveNote} style={{ width: "100%", padding: 12, marginTop: 10, background: noteSaved ? DS.colors.blackSoft : DS.colors.red, border: "none", borderRadius: DS.r.md, color: DS.colors.whitePure, fontSize: 12, fontFamily: DS.font, letterSpacing: 2, cursor: "pointer", transition: "all 0.2s" }}>
          {noteSaved ? "✓ SAVED" : "SAVE NOTE"}
        </button>
      </div>
    </div>
  );
}

/* ═══════ INLINE STOPWATCH (collapsible, in Today tab) ═══════ */
function InlineStopwatch() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    if (running) ref.current = setInterval(() => setTime(t => t + 10), 10);
    else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [running]);

  const prog = Math.min((time % 60000) / 60000, 1);
  const circ = 2 * Math.PI * 70;

  return (
    <div style={{ marginBottom: 20, animation: "fadeUp 0.5s ease" }}>
      {/* Toggle bar */}
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "14px 16px", ...cardSt, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderColor: running ? DS.colors.red : DS.colors.grayBorder,
        transition: "border-color 0.2s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: DS.r.md, background: running ? DS.colors.redGlow : DS.colors.blackMid, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            <Icon name="timer" size={18} color={running ? DS.colors.red : DS.colors.grayLight} />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: DS.font, fontSize: 13, color: DS.colors.whitePure, letterSpacing: 1 }}>STOPWATCH</div>
            {(time > 0 || running) && (
              <div style={{ fontSize: 18, fontFamily: "'DM Sans', monospace", fontWeight: 700, color: running ? DS.colors.red : DS.colors.grayLight, marginTop: 2 }}>{fmtTime(time)}</div>
            )}
            {time === 0 && !running && <div style={{ fontSize: 11, color: DS.colors.gray, marginTop: 2 }}>Track rest times</div>}
          </div>
        </div>
        <div style={{ transform: open ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>
          <Icon name="chevDown" size={16} color={DS.colors.grayLight} />
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div style={{ marginTop: 8, ...cardSt, padding: "20px 16px", animation: "scaleIn 0.2s ease" }}>
          {/* Ring */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ position: "relative", width: 160, height: 160 }}>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="80" cy="80" r="70" fill="none" stroke={DS.colors.blackMid} strokeWidth="4" />
                <circle cx="80" cy="80" r="70" fill="none" stroke={DS.colors.red} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={circ * (1 - prog)} strokeLinecap="round" style={{ transition: running ? "none" : "stroke-dashoffset 0.3s ease" }} />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 28, fontWeight: 700, color: DS.colors.whitePure, letterSpacing: 1 }}>{fmtTime(time)}</div>
                {laps.length > 0 && <div style={{ fontSize: 10, color: DS.colors.gray, marginTop: 2 }}>LAP {laps.length}</div>}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: laps.length ? 16 : 0 }}>
            <button onClick={() => { setRunning(false); setTime(0); setLaps([]); }} style={{ width: 48, height: 48, borderRadius: DS.r.full, background: DS.colors.blackMid, border: `1px solid ${DS.colors.grayBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="reset" size={16} color={DS.colors.grayLight} />
            </button>
            <button onClick={() => setRunning(!running)} style={{ width: 60, height: 60, borderRadius: DS.r.full, background: running ? DS.colors.whitePure : DS.colors.red, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: running ? "none" : `0 0 28px ${DS.colors.redGlowStrong}`, transition: "all 0.2s" }}>
              <Icon name={running ? "pause" : "play"} size={22} color={running ? DS.colors.black : DS.colors.whitePure} />
            </button>
            <button onClick={() => running && setLaps(p => [time, ...p])} disabled={!running} style={{ width: 48, height: 48, borderRadius: DS.r.full, background: DS.colors.blackMid, border: `1px solid ${DS.colors.grayBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: running ? "pointer" : "not-allowed", opacity: running ? 1 : 0.3 }}>
              <Icon name="timer" size={16} color={DS.colors.grayLight} />
            </button>
          </div>

          {/* Laps */}
          {laps.length > 0 && laps.map((lap, i) => {
            const prev = laps[i + 1] || 0;
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: DS.colors.blackMid, borderRadius: DS.r.md, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: DS.colors.gray }}>Lap {laps.length - i}</span>
                <span style={{ fontSize: 11, color: DS.colors.grayLight }}>+{fmtTime(lap - prev)}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: DS.colors.whitePure, fontFamily: "monospace" }}>{fmtTime(lap)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 2 — ANALYTICS
   ═══════════════════════════════════════════════════ */
function AnalyticsTab({ workouts, onAdd, onReuse, templates }) {
  const totalW = Object.values(workouts).reduce((s, a) => s + a.length, 0);
  const totalSets = Object.values(workouts).flat().reduce((s, w) => s + (w.exercises?.reduce((ss, e) => ss + e.sets.length, 0) || 0), 0);
  const totalVol = Object.values(workouts).flat().reduce((s, w) => s + (w.exercises?.reduce((ss, e) => ss + e.sets.reduce((sv, set) => sv + set.reps * set.kgs, 0), 0) || 0), 0);

  let streak = 0; const d = new Date();
  while (workouts[dk(d)]?.length > 0) { streak++; d.setDate(d.getDate() - 1); }

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(); dd.setDate(dd.getDate() - (6 - i)); const k = dk(dd);
    const vol = (workouts[k]||[]).reduce((s,w) => s + (w.exercises?.reduce((ss,e) => ss + e.sets.reduce((sv,set) => sv + set.reps * set.kgs, 0), 0) || 0), 0);
    return { date: dd, key: k, count: (workouts[k]||[]).length, vol };
  });
  const maxVol = Math.max(...last7.map(d => d.vol), 1);

  const exCount = {};
  Object.values(workouts).flat().forEach(w => w.exercises?.forEach(e => { exCount[e.name] = (exCount[e.name]||0) + 1; }));
  const topEx = Object.entries(exCount).sort(([,a],[,b]) => b - a).slice(0, 5);
  const maxExC = topEx.length ? topEx[0][1] : 1;

  const [showT, setShowT] = useState(false);

  return (
    <div style={{ padding: "20px 20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontFamily: DS.font, fontSize: 20, letterSpacing: 2, color: DS.colors.whitePure }}>STATS</h1>
        <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: 4, background: DS.colors.red, border: "none", borderRadius: DS.r.full, padding: "8px 16px 8px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700, color: DS.colors.whitePure, letterSpacing: 0.5, boxShadow: `0 4px 16px ${DS.colors.redGlow}` }}>
          <Icon name="plus" size={16} color={DS.colors.whitePure} /> ADD
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { val: streak, unit: "days", lbl: "STREAK", icon: "fire", c: DS.colors.red },
          { val: totalW, unit: "", lbl: "WORKOUTS", icon: "dumbbell", c: DS.colors.whitePure },
          { val: totalSets, unit: "", lbl: "TOTAL SETS", icon: "target", c: DS.colors.grayLight },
          { val: totalVol > 1000 ? `${(totalVol/1000).toFixed(1)}k` : totalVol, unit: "kg", lbl: "VOLUME", icon: "trendUp", c: DS.colors.red },
        ].map((s, i) => (
          <div key={i} style={{ ...cardSt, padding: "18px 16px", animation: `fadeUp 0.3s ease ${i*0.06}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}><Icon name={s.icon} size={18} color={s.c} /><span style={{ fontSize: 9, color: DS.colors.gray, letterSpacing: 1 }}>{s.lbl}</span></div>
            <div style={{ fontFamily: DS.font, fontSize: 26, color: s.c }}>{s.val}<span style={{ fontSize: 12, color: DS.colors.gray, marginLeft: 2 }}>{s.unit}</span></div>
          </div>
        ))}
      </div>

      <div style={{ ...cardSt, padding: "18px 16px", marginBottom: 20 }}>
        <span style={{ ...labelSt, marginBottom: 14 }}>LAST 7 DAYS</span>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
          {last7.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: "100%", borderRadius: DS.r.sm, height: Math.max(4, (d.vol / maxVol) * 80), background: d.key === todayKey() ? DS.colors.red : d.count > 0 ? DS.colors.grayBorder : `${DS.colors.grayBorder}44`, transition: "height 0.5s ease" }} />
              <span style={{ fontSize: 9, color: d.key === todayKey() ? DS.colors.red : DS.colors.gray, fontWeight: 600 }}>{DAYS_MIN[(d.date.getDay()+6)%7]}</span>
            </div>
          ))}
        </div>
      </div>

      {topEx.length > 0 && (
        <div style={{ ...cardSt, padding: "18px 16px", marginBottom: 20 }}>
          <span style={{ ...labelSt, marginBottom: 14 }}>TOP EXERCISES</span>
          {topEx.map(([name, count], i) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < topEx.length - 1 ? 10 : 0 }}>
              <span style={{ fontSize: 12, color: DS.colors.red, fontFamily: DS.font, width: 20, textAlign: "center" }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{name}</div>
                <div style={{ height: 4, borderRadius: 2, background: DS.colors.blackMid, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 2, background: DS.colors.red, width: `${(count/maxExC)*100}%`, transition: "width 0.5s ease" }} /></div>
              </div>
              <span style={{ fontSize: 11, color: DS.colors.gray, minWidth: 24, textAlign: "right" }}>{count}×</span>
            </div>
          ))}
        </div>
      )}

      {templates.length > 0 && (
        <div>
          <button onClick={() => setShowT(!showT)} style={{ width: "100%", padding: "14px 16px", ...cardSt, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="copy" size={18} color={DS.colors.red} /><span style={{ fontFamily: DS.font, fontSize: 12, color: DS.colors.whitePure, letterSpacing: 1 }}>REUSE WORKOUT</span></div>
            <div style={{ transform: showT ? "rotate(180deg)" : "", transition: "transform 0.2s" }}><Icon name="chevDown" size={16} color={DS.colors.grayLight} /></div>
          </button>
          {showT && <div style={{ marginTop: 8, animation: "scaleIn 0.2s ease" }}>
            {templates.map((w, i) => (
              <button key={i} onClick={() => onReuse(w)} style={{ width: "100%", padding: "12px 16px", marginBottom: 6, background: DS.colors.blackMid, border: `1px solid ${DS.colors.grayBorder}`, borderRadius: DS.r.md, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontWeight: 600, fontSize: 13, color: DS.colors.whitePure, marginBottom: 2 }}>{w.name}</div><div style={{ fontSize: 10, color: DS.colors.gray }}>{w.exercises?.map(e=>e.name).join(" · ")}</div></div>
                <Icon name="plus" size={14} color={DS.colors.red} />
              </button>
            ))}
          </div>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 3 — WORKOUTS (weekly day-by-day log)
   ═══════════════════════════════════════════════════ */
function WorkoutsTab({ workouts, notes, onDelete, onReuse }) {
  const [weekOff, setWeekOff] = useState(0);
  const ref = new Date(); ref.setDate(ref.getDate() + weekOff * 7);
  const week = getWeekDates(ref);
  const weekLabel = `${week[0].toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${week[6].toLocaleDateString("en-US",{month:"short",day:"numeric"})}`;

  return (
    <div style={{ padding: "20px 20px 24px" }}>
      <h1 style={{ fontFamily: DS.font, fontSize: 20, letterSpacing: 2, color: DS.colors.whitePure, marginBottom: 20 }}>WORKOUT LOG</h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button onClick={() => setWeekOff(w=>w-1)} style={navBtnSt}><Icon name="chevLeft" size={16} /></button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: DS.font, fontSize: 13, letterSpacing: 1 }}>{weekLabel}</div>
          {weekOff !== 0 && <button onClick={() => setWeekOff(0)} style={{ background: "none", border: "none", color: DS.colors.red, fontSize: 11, cursor: "pointer", marginTop: 4, fontWeight: 600 }}>This week</button>}
        </div>
        <button onClick={() => setWeekOff(w=>w+1)} style={navBtnSt}><Icon name="chevRight" size={16} /></button>
      </div>

      {week.map((date, i) => {
        const k = dk(date), isTd = k === todayKey(), dw = workouts[k] || [], dn = notes[k] || "";
        return (
          <div key={k} style={{ marginBottom: 16, animation: `fadeUp 0.3s ease ${i*0.04}s both` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: DS.r.md, background: isTd ? DS.colors.red : DS.colors.blackLight, border: isTd ? "none" : `1px solid ${DS.colors.grayBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DS.font, fontSize: 14, color: DS.colors.whitePure }}>{date.getDate()}</div>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: isTd ? DS.colors.red : DS.colors.whitePure }}>{DAYS[i]}</div><div style={{ fontSize: 10, color: DS.colors.gray }}>{date.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div></div>
              {dw.length > 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: DS.colors.red, marginLeft: "auto" }} />}
            </div>
            {dw.length > 0 ? dw.map(w => (
              <div key={w.id} style={{ ...cardSt, padding: "12px 14px", marginBottom: 6, marginLeft: 46 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: DS.font, fontSize: 12, color: DS.colors.red }}>{w.name}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => onReuse(w)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: 0.5 }}><Icon name="copy" size={12} color={DS.colors.grayLight} /></button>
                    <button onClick={() => onDelete(k, w.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: 0.5 }}><Icon name="trash" size={12} color={DS.colors.red} /></button>
                  </div>
                </div>
                {w.exercises?.map((ex, j) => (
                  <div key={j} style={{ marginBottom: j < w.exercises.length - 1 ? 6 : 0 }}>
                    <ExName name={ex.name} videoUrl={ex.videoUrl} size={12} />
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 3 }}>
                      {ex.sets.map((s, si) => <span key={si} style={{ fontSize: 10, padding: "2px 6px", borderRadius: DS.r.sm, background: DS.colors.blackMid, color: DS.colors.grayLight }}><span style={{ color: DS.colors.red, fontWeight: 600 }}>{s.reps}</span>×<span style={{ fontWeight: 600 }}>{s.kgs}</span>kg</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )) : <div style={{ marginLeft: 46, padding: "8px 0", fontSize: 12, color: DS.colors.gray, fontStyle: "italic" }}>Rest day</div>}
            {dn && (
              <div style={{ marginLeft: 46, padding: "8px 12px", borderRadius: DS.r.md, background: DS.colors.blackMid, border: `1px solid ${DS.colors.grayBorder}33`, marginTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}><Icon name="note" size={10} color={DS.colors.gray} /><span style={{ fontSize: 9, color: DS.colors.gray, letterSpacing: 1, fontWeight: 600 }}>NOTE</span></div>
                <p style={{ fontSize: 12, color: DS.colors.grayLight, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{dn}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 4 — PLANNING (Calendar)
   ═══════════════════════════════════════════════════ */
function PlanningTab({ workouts, notes, onAdd, onDelete, onSaveNote }) {
  const [calView, setCalView] = useState("week");
  const [calDate, setCalDate] = useState(new Date());
  const [selDate, setSelDate] = useState(todayKey());
  const [noteText, setNoteText] = useState(notes[todayKey()] || "");
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => { setNoteText(notes[selDate] || ""); setNoteSaved(false); }, [selDate, notes]);
  const handleSaveNote = () => { onSaveNote(selDate, noteText); setNoteSaved(true); setTimeout(() => setNoteSaved(false), 2000); };

  const shiftW = (dir) => { const d = new Date(calDate); d.setDate(d.getDate()+dir*7); setCalDate(d); };
  const shiftM = (dir) => { const d = new Date(calDate); d.setMonth(d.getMonth()+dir); setCalDate(d); };

  const weekDates = getWeekDates(calDate);
  const monthDates = getMonthDates(calDate.getFullYear(), calDate.getMonth());
  const hasData = (d) => { const k = dk(d); return (workouts[k]?.length > 0) || notes[k]; };
  const isTd = (d) => dk(d) === todayKey();
  const selW = workouts[selDate] || [];

  return (
    <div style={{ padding: "20px 20px 24px" }}>
      <h1 style={{ fontFamily: DS.font, fontSize: 20, letterSpacing: 2, color: DS.colors.whitePure, marginBottom: 20 }}>PLANNING</h1>

      <div style={{ display: "flex", background: DS.colors.blackLight, borderRadius: DS.r.full, padding: 3, marginBottom: 16, border: `1px solid ${DS.colors.grayBorder}` }}>
        {["week","month"].map(v => <button key={v} onClick={() => setCalView(v)} style={{ flex: 1, padding: "9px 0", background: calView === v ? DS.colors.red : "transparent", border: "none", borderRadius: DS.r.full, color: calView === v ? DS.colors.whitePure : DS.colors.gray, fontSize: 10, fontFamily: DS.font, letterSpacing: 1, cursor: "pointer", transition: "all 0.2s" }}>{v.toUpperCase()}</button>)}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <button onClick={() => calView==="week"?shiftW(-1):shiftM(-1)} style={navBtnSt}><Icon name="chevLeft" size={16} /></button>
        <span style={{ fontFamily: DS.font, fontSize: 13, letterSpacing: 1 }}>
          {calView === "week" ? `${weekDates[0].toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${weekDates[6].toLocaleDateString("en-US",{month:"short",day:"numeric"})}` : `${MONTHS[calDate.getMonth()]} ${calDate.getFullYear()}`}
        </span>
        <button onClick={() => calView==="week"?shiftW(1):shiftM(1)} style={navBtnSt}><Icon name="chevRight" size={16} /></button>
      </div>

      {calView === "week" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, marginBottom: 20 }}>
          {weekDates.map((d, i) => {
            const k = dk(d), td = isTd(d), sel = k === selDate, has = hasData(d);
            return (
              <button key={i} onClick={() => setSelDate(k)} style={{ background: td ? DS.colors.red : sel ? DS.colors.blackMid : DS.colors.blackLight, border: `1px solid ${sel && !td ? DS.colors.red : td ? DS.colors.red : DS.colors.grayBorder}`, borderRadius: DS.r.md, padding: "8px 2px 12px", cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", minHeight: 78, transition: "all 0.15s" }}>
                <span style={{ fontSize: 9, color: td ? "rgba(255,255,255,0.7)" : DS.colors.gray, letterSpacing: 1, fontWeight: 600 }}>{DAYS_MIN[i]}</span>
                <span style={{ fontFamily: DS.font, fontSize: 15, color: DS.colors.whitePure, margin: "4px 0 6px" }}>{d.getDate()}</span>
                {has && <div style={{ width: 5, height: 5, borderRadius: "50%", background: td ? DS.colors.whitePure : DS.colors.red }} />}
              </button>
            );
          })}
        </div>
      )}

      {calView === "month" && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 4 }}>
            {DAYS_MIN.map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 9, color: DS.colors.gray, fontWeight: 700, letterSpacing: 1, padding: 3 }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
            {monthDates.map(({ date, inMonth }, i) => {
              const k = dk(date), td = isTd(date), sel = k === selDate, has = hasData(date);
              return (
                <button key={i} onClick={() => inMonth && setSelDate(k)} style={{ background: td ? DS.colors.red : sel && inMonth ? DS.colors.blackMid : "transparent", border: sel && inMonth && !td ? `1px solid ${DS.colors.red}` : "1px solid transparent", borderRadius: DS.r.sm, padding: "7px 2px", cursor: inMonth ? "pointer" : "default", textAlign: "center", opacity: inMonth ? 1 : 0.2, position: "relative" }}>
                  <span style={{ fontSize: 12, color: DS.colors.white, fontWeight: td ? 700 : 400 }}>{date.getDate()}</span>
                  {has && inMonth && <div style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: td ? DS.colors.whitePure : DS.colors.red }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ ...cardSt, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: DS.colors.whitePure }}>{parseDate(selDate).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</span>
          <button onClick={() => onAdd(selDate)} style={{ display: "flex", alignItems: "center", gap: 4, background: DS.colors.redGlow, border: `1px solid ${DS.colors.red}44`, borderRadius: DS.r.full, padding: "5px 12px 5px 8px", cursor: "pointer", fontSize: 10, fontWeight: 700, color: DS.colors.red, letterSpacing: 0.5 }}><Icon name="plus" size={12} color={DS.colors.red} /> ADD</button>
        </div>
        {selW.length > 0 ? selW.map(w => (
          <div key={w.id} style={{ background: DS.colors.blackMid, borderRadius: DS.r.md, padding: "10px 12px", marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: DS.font, fontSize: 12, color: DS.colors.red }}>{w.name}</span>
              <button onClick={() => onDelete(selDate, w.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: 0.5 }}><Icon name="trash" size={12} color={DS.colors.red} /></button>
            </div>
            {w.exercises?.map((ex, j) => <div key={j} style={{ fontSize: 12, color: DS.colors.grayLight, marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}><VideoBtn url={ex.videoUrl} size={12} />{ex.name} — {ex.sets.map((s,si) => <span key={si} style={{ color: DS.colors.red }}>{s.reps}×{s.kgs}kg{si<ex.sets.length-1?", ":""}</span>)}</div>)}
          </div>
        )) : <p style={{ fontSize: 12, color: DS.colors.gray, fontStyle: "italic" }}>No workout planned</p>}
      </div>

      <div>
        <span style={labelSt}>NOTE FOR {parseDate(selDate).toLocaleDateString("en-US",{month:"short",day:"numeric"}).toUpperCase()}</span>
        <textarea value={noteText} onChange={e => { setNoteText(e.target.value); setNoteSaved(false); }} placeholder="Plan your session..." rows={3} style={{ ...inpSt, resize: "vertical", lineHeight: 1.6, minHeight: 80 }} />
        <button onClick={handleSaveNote} style={{ width: "100%", padding: 11, marginTop: 8, background: noteSaved ? DS.colors.blackSoft : DS.colors.red, border: "none", borderRadius: DS.r.md, color: DS.colors.whitePure, fontSize: 11, fontFamily: DS.font, letterSpacing: 2, cursor: "pointer" }}>
          {noteSaved ? "✓ SAVED" : "SAVE NOTE"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ADD WORKOUT — Full-screen overlay
   ═══════════════════════════════════════════════════ */
function AddWorkoutOverlay({ date, setDate, template, onAdd, onClose, videoMap = {} }) {
  const [name, setName] = useState(template?.name || "");
  const [exercises, setExercises] = useState(template?.exercises || []);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exName, setExName] = useState(EXERCISES[0]);
  const [custom, setCustom] = useState(""); const [useCustom, setUseCustom] = useState(false);
  const [search, setSearch] = useState("");
  const [numSets, setNumSets] = useState(3);
  const [setsData, setSetsData] = useState([{reps:"10",kgs:"0"},{reps:"10",kgs:"0"},{reps:"10",kgs:"0"}]);
  const [videoUrl, setVideoUrl] = useState(videoMap[EXERCISES[0]] || "");

  // Auto-fill video URL when exercise selection changes
  const selectExercise = (exn) => { setExName(exn); setSearch(""); setVideoUrl(videoMap[exn] || ""); };

  const filtered = EXERCISES.filter(e => e.toLowerCase().includes(search.toLowerCase()));
  const changeNum = (n) => { const num = Math.max(1,Math.min(20,n)); setNumSets(num); setSetsData(p => { const nx=[...p]; while(nx.length<num){const l=nx[nx.length-1]||{reps:"10",kgs:"0"};nx.push({...l});}return nx.slice(0,num);}); };
  const updSet = (i,f,v) => setSetsData(p=>p.map((s,idx)=>idx===i?{...s,[f]:v}:s));

  const addEx = () => {
    const n = useCustom ? custom.trim() : exName; if(!n) return;
    const url = videoUrl.trim();
    setExercises(p=>[...p,{name:n, videoUrl: url || undefined, sets:setsData.slice(0,numSets).map(s=>({reps:parseInt(s.reps)||0,kgs:parseFloat(s.kgs)||0}))}]);
    setShowForm(false); setSearch(""); setCustom(""); setUseCustom(false); setVideoUrl("");
    setNumSets(3); setSetsData([{reps:"10",kgs:"0"},{reps:"10",kgs:"0"},{reps:"10",kgs:"0"}]);
  };
  const removeEx = (i) => setExercises(p=>p.filter((_,idx)=>idx!==i));
  const updExSet = (ei,si,f,v) => setExercises(p=>p.map((ex,i)=>{ if(i!==ei)return ex; return {...ex,sets:ex.sets.map((s,j)=>j===si?{...s,[f]:f==="reps"?(parseInt(v)||0):(parseFloat(v)||0)}:s)}; }));

  const doSave = async () => {
    if(!name.trim()||!exercises.length) return;
    await onAdd(date, { name: name.trim(), exercises });
    setSaved(true); setTimeout(onClose, 900);
  };

  if (saved) return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: DS.colors.black, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, animation: "scaleIn 0.3s ease" }}>
      <div style={{ width: 64, height: 64, borderRadius: DS.r.full, background: DS.colors.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${DS.colors.redGlowStrong}` }}><Icon name="check" size={32} color={DS.colors.whitePure} /></div>
      <span style={{ fontFamily: DS.font, fontSize: 16, letterSpacing: 1, color: DS.colors.whitePure }}>WORKOUT SAVED</span>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: DS.colors.black, overflowY: "auto", animation: "slideUp 0.3s ease" }}>
      <div style={{ padding: "20px 20px 40px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, paddingTop: 4 }}>
          <button onClick={onClose} style={{ background: DS.colors.blackLight, border: `1px solid ${DS.colors.grayBorder}`, borderRadius: DS.r.full, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icon name="x" size={18} color={DS.colors.white} /></button>
          <h2 style={{ fontFamily: DS.font, fontSize: 16, letterSpacing: 2, color: DS.colors.whitePure }}>{template ? "REUSE WORKOUT" : "NEW WORKOUT"}</h2>
        </div>

        {template && <div style={{ background: DS.colors.redGlow, border: `1px solid ${DS.colors.red}33`, borderRadius: DS.r.md, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Icon name="copy" size={14} color={DS.colors.red} /><span style={{ fontSize: 12, color: DS.colors.red }}>Loaded from template — edit sets below</span></div>}

        <div style={{ marginBottom: 18 }}><label style={labelSt}>DATE</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{...inpSt,colorScheme:"dark"}} /></div>
        <div style={{ marginBottom: 18 }}><label style={labelSt}>WORKOUT NAME</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Push Day, Leg Day..." style={inpSt} /></div>

        {exercises.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <label style={labelSt}>EXERCISES ({exercises.length})</label>
            {exercises.map((ex,i) => (
              <div key={i} style={{ ...cardSt, padding: "12px 12px 8px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <ExName name={ex.name} videoUrl={ex.videoUrl} size={13} />
                  <button onClick={()=>removeEx(i)} style={{ background:"none",border:"none",cursor:"pointer",padding:4,opacity:0.5 }}><Icon name="trash" size={13} color={DS.colors.red}/></button>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"36px 1fr 1fr",gap:5,marginBottom:3 }}>
                  <span style={{ fontSize:9,color:DS.colors.gray,letterSpacing:1,fontWeight:700 }}>SET</span>
                  <span style={{ fontSize:9,color:DS.colors.gray,letterSpacing:1,fontWeight:700 }}>REPS</span>
                  <span style={{ fontSize:9,color:DS.colors.gray,letterSpacing:1,fontWeight:700 }}>KG</span>
                </div>
                {ex.sets.map((s,j) => (
                  <div key={j} style={{ display:"grid",gridTemplateColumns:"36px 1fr 1fr",gap:5,marginBottom:3 }}>
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:DS.colors.red,fontWeight:700,background:DS.colors.redGlow,borderRadius:DS.r.sm,height:34 }}>{j+1}</div>
                    <input type="number" value={s.reps} onChange={e=>updExSet(i,j,"reps",e.target.value)} style={{...setInpSt,height:34}} min="0" />
                    <input type="number" value={s.kgs} onChange={e=>updExSet(i,j,"kgs",e.target.value)} style={{...setInpSt,height:34}} min="0" step="0.5" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {showForm ? (
          <div style={{ ...cardSt, border: `1px solid ${DS.colors.red}`, padding: 16, marginBottom: 18, animation: "scaleIn 0.2s ease" }}>
            <div style={{ fontSize: 11, color: DS.colors.red, letterSpacing: 1, marginBottom: 12, fontWeight: 600 }}>ADD EXERCISE</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {[{v:false,l:"SELECT"},{v:true,l:"CUSTOM"}].map(t => <button key={t.l} onClick={()=>setUseCustom(t.v)} style={{ flex:1,padding:"7px",border:`1px solid ${useCustom===t.v?DS.colors.red:DS.colors.grayBorder}`,background:useCustom===t.v?DS.colors.redGlow:"transparent",borderRadius:DS.r.sm,color:DS.colors.white,fontSize:10,cursor:"pointer",letterSpacing:1,fontWeight:600 }}>{t.l}</button>)}
            </div>
            {useCustom ? <input value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Exercise name..." style={{...inpSt,marginBottom:12}} /> : (
              <div style={{ marginBottom: 12 }}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search exercises..." style={{...inpSt,marginBottom:6}} />
                <div style={{ maxHeight:130,overflowY:"auto",background:DS.colors.blackMid,borderRadius:DS.r.md,border:`1px solid ${DS.colors.grayBorder}` }}>
                  {filtered.map(ex => <button key={ex} onClick={()=>selectExercise(ex)} style={{ display:"block",width:"100%",padding:"9px 12px",background:exName===ex?DS.colors.redGlow:"transparent",border:"none",borderBottom:`1px solid ${DS.colors.grayBorder}`,color:exName===ex?DS.colors.red:DS.colors.white,fontSize:12,textAlign:"left",cursor:"pointer",fontWeight:exName===ex?600:400,fontFamily:DS.body }}>{ex}</button>)}
                </div>
              </div>
            )}
            {/* YouTube URL */}
            <div style={{ marginBottom: 12 }}>
              <label style={{...labelSt,marginBottom:6}}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="youtube" size={12} color="#FF0000" /> VIDEO LINK <span style={{ color: DS.colors.gray, fontWeight: 400 }}>(optional)</span>
                </span>
              </label>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="Paste YouTube URL..." style={{...inpSt, flex: 1, padding: "10px 12px", fontSize: 12 }} />
                {videoUrl && <VideoBtn url={videoUrl} size={16} />}
              </div>
              {videoUrl && !videoUrl.includes("youtu") && <p style={{ fontSize: 10, color: DS.colors.gray, marginTop: 4 }}>Any URL works — YouTube recommended</p>}
            </div>

            <div style={{ marginBottom: 12 }}><label style={{...labelSt,marginBottom:6}}>SETS</label><div style={{ display:"flex",alignItems:"center",gap:10 }}><button onClick={()=>changeNum(numSets-1)} style={numBtnSt}>−</button><span style={{ fontFamily:DS.font,fontSize:18,color:DS.colors.red,minWidth:24,textAlign:"center" }}>{numSets}</span><button onClick={()=>changeNum(numSets+1)} style={numBtnSt}>+</button></div></div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display:"grid",gridTemplateColumns:"36px 1fr 1fr",gap:5,marginBottom:4 }}><span style={{ fontSize:9,color:DS.colors.gray,letterSpacing:1,fontWeight:700 }}>SET</span><span style={{ fontSize:9,color:DS.colors.gray,letterSpacing:1,fontWeight:700 }}>REPS</span><span style={{ fontSize:9,color:DS.colors.gray,letterSpacing:1,fontWeight:700 }}>KG</span></div>
              {setsData.slice(0,numSets).map((s,i) => (
                <div key={i} style={{ display:"grid",gridTemplateColumns:"36px 1fr 1fr",gap:5,marginBottom:3 }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:DS.colors.red,fontWeight:700,background:DS.colors.redGlow,borderRadius:DS.r.sm,height:36 }}>{i+1}</div>
                  <input type="number" value={s.reps} onChange={e=>updSet(i,"reps",e.target.value)} style={setInpSt} min="0" />
                  <input type="number" value={s.kgs} onChange={e=>updSet(i,"kgs",e.target.value)} style={setInpSt} min="0" step="0.5" />
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={()=>setShowForm(false)} style={{ flex:1,padding:11,background:DS.colors.blackMid,border:`1px solid ${DS.colors.grayBorder}`,borderRadius:DS.r.md,color:DS.colors.grayLight,fontSize:11,cursor:"pointer",fontWeight:600 }}>CANCEL</button>
              <button onClick={addEx} style={{ flex:1,padding:11,background:DS.colors.red,border:"none",borderRadius:DS.r.md,color:DS.colors.whitePure,fontSize:11,cursor:"pointer",fontFamily:DS.font,letterSpacing:1 }}>ADD</button>
            </div>
          </div>
        ) : (
          <button onClick={()=>setShowForm(true)} style={{ width:"100%",padding:13,marginBottom:18,background:"transparent",border:`2px dashed ${DS.colors.grayBorder}`,borderRadius:DS.r.md,color:DS.colors.grayLight,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.2s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=DS.colors.red;e.currentTarget.style.color=DS.colors.red;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=DS.colors.grayBorder;e.currentTarget.style.color=DS.colors.grayLight;}}>
            <Icon name="plus" size={14} color="currentColor" /> Add Exercise
          </button>
        )}

        <button onClick={doSave} disabled={!name.trim()||!exercises.length} style={{ width:"100%",padding:15,background:(!name.trim()||!exercises.length)?DS.colors.blackSoft:DS.colors.red,border:"none",borderRadius:DS.r.md,color:(!name.trim()||!exercises.length)?DS.colors.gray:DS.colors.whitePure,fontSize:14,fontFamily:DS.font,letterSpacing:2,cursor:(!name.trim()||!exercises.length)?"not-allowed":"pointer",boxShadow:(!name.trim()||!exercises.length)?"none":`0 4px 20px ${DS.colors.redGlow}` }}>SAVE WORKOUT</button>
      </div>
    </div>
  );
}

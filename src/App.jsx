import { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  Check,
  Plus,
  Minus,
  RotateCcw,
  Dumbbell,
  Activity,
  Apple,
  Calendar,
  Info,
  Bike,
  Footprints,
} from "lucide-react";

// ────────────────────────────────────────────────────────────
// Storage — localStorage for the deployed web app
// ────────────────────────────────────────────────────────────
const STORAGE_KEY = "sister-iron-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { logs: {}, completed: {} };
  } catch {
    return { logs: {}, completed: {} };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Save failed", e);
  }
}

// ────────────────────────────────────────────────────────────
// Sister Iron Mascot
// ────────────────────────────────────────────────────────────
const Mascot = ({ size = 52 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className="shrink-0 drop-shadow-md">
    <defs>
      <linearGradient id="mascotBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="50%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <linearGradient id="haloGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>

    <circle cx="32" cy="32" r="32" fill="url(#mascotBg)" />

    <g fill="#fef3c7" opacity="0.9">
      <path d="M52 13 l1 -2 l1 2 l2 1 l-2 1 l-1 2 l-1 -2 l-2 -1 z" />
      <path d="M10 22 l0.6 -1.2 l0.6 1.2 l1.2 0.6 l-1.2 0.6 l-0.6 1.2 l-0.6 -1.2 l-1.2 -0.6 z" />
      <circle cx="13" cy="46" r="0.8" />
      <circle cx="55" cy="48" r="0.8" />
    </g>

    <ellipse cx="32" cy="11" rx="13" ry="2.5" fill="none" stroke="url(#haloGrad)" strokeWidth="2" />

    <path d="M10 36 Q10 18 22 14 Q32 10 42 14 Q54 18 54 36 L54 64 L10 64 Z" fill="#0f172a" />

    <ellipse cx="32" cy="32" rx="15.5" ry="14" fill="#ffffff" />
    <ellipse cx="32" cy="32" rx="12.5" ry="11.5" fill="#fde7c8" />

    <path d="M22.5 26 L29 27.5" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M35 27.5 L41.5 26" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

    <ellipse cx="27" cy="32" rx="1.5" ry="2" fill="#0f172a" />
    <ellipse cx="37" cy="32" rx="1.5" ry="2" fill="#0f172a" />
    <circle cx="27.4" cy="31.4" r="0.55" fill="#ffffff" />
    <circle cx="37.4" cy="31.4" r="0.55" fill="#ffffff" />

    <path d="M27 38 Q32 41 38 37.5" stroke="#0f172a" strokeWidth="1.8" fill="none" strokeLinecap="round" />

    <ellipse cx="22.5" cy="36" rx="2" ry="1.3" fill="#fb7185" opacity="0.45" />
    <ellipse cx="41.5" cy="36" rx="2" ry="1.3" fill="#fb7185" opacity="0.45" />

    <g transform="translate(46, 46)">
      <rect x="-6" y="-1.5" width="12" height="3" fill="#1e293b" rx="0.5" />
      <rect x="-8" y="-4" width="3" height="8" fill="#1e293b" rx="0.5" />
      <rect x="5" y="-4" width="3" height="8" fill="#1e293b" rx="0.5" />
    </g>
  </svg>
);

// ────────────────────────────────────────────────────────────
// Plan data
// ────────────────────────────────────────────────────────────
const days = [
  {
    id: "d1",
    name: "Day 1 · Glutes",
    short: "Glutes",
    duration: "55–60 min + cardio",
    summary: "Glute-dominant lower body. Quads stay quiet.",
    exercises: [
      { name: "Dumbbell Hip Thrust", sets: 4, reps: "10–12", rest: "90s",
        notes: "Shoulders on bench, DB on hip crease (use a pad). Pause 1s at the top — full glute squeeze, ribs down. Main lift of the day." },
      { name: "DB Side-Lying Hip Abduction", sets: 3, reps: "12–15 / side", rest: "60s",
        notes: "Lie on side, bottom leg bent. Light DB on outside of top thigh. Lift with slight backward angle to bias glute med over TFL. Slow down." },
      { name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10", rest: "75s",
        notes: "Soft knees, hinge from hips, DBs glide down the thigh. Stop when hamstring stretches — don't chase the floor." },
      { name: "B-Stance DB Hip Thrust", sets: 3, reps: "10 / side", rest: "60s",
        notes: "Working leg flat, support leg up on toes — kickstand only. ~70% load on the working glute." },
      { name: "Cable Pull-Through", sets: 3, reps: "12", rest: "60s",
        notes: "Rope on low pulley between legs. Hinge back, drive forward by squeezing glutes. Arms stay passive." },
      { name: "Glute Bridge Hold", sets: 2, reps: "30s hold", rest: "45s", timeBased: true,
        notes: "Finisher. Push through heels. Ribs tucked. Burn it out. Log seconds in the reps field." },
    ],
    cardio: {
      title: "Recovery Cardio", type: "Bike or Walk", duration: "10 min",
      intensity: "Very easy", icon: "bike",
      notes: "Active recovery only — don't tax the legs after heavy hip thrusts. Spin gently on a stationary bike or do a flat treadmill walk. Just move blood through.",
    },
  },
  {
    id: "d2",
    name: "Day 2 · Push & Core",
    short: "Push",
    duration: "50–55 min + cardio",
    summary: "Upper body push and a midline that won't fold.",
    exercises: [
      { name: "Incline DB Press", sets: 4, reps: "8–10", rest: "90s",
        notes: "Bench at 30°. Elbows ~45° from torso. Full stretch at the bottom, drive up." },
      { name: "DB Lateral Raise", sets: 3, reps: "12–15", rest: "45s",
        notes: "Slight forward lean. Lead with elbows. Pinky a touch higher than thumb. Light weight, perfect form." },
      { name: "DB Arnold Press (seated)", sets: 3, reps: "10", rest: "60s",
        notes: "Start palms-in at shoulders, rotate as you press. Slow and controlled — shoulder builder, not a power move." },
      { name: "Cable Triceps Pushdown", sets: 3, reps: "12", rest: "60s",
        notes: "Elbows pinned to ribs. Full extension at bottom, slow on the way up." },
      { name: "Hollow Body Hold", sets: 3, reps: "20–30s", rest: "45s", timeBased: true,
        notes: "Lower back glued to the floor. If shoulders and legs shake, you're doing it right. Log seconds in reps field." },
      { name: "Cable Woodchopper", sets: 3, reps: "10 / side", rest: "45s",
        notes: "High to low. Rotate from the trunk, not the arms. Builds rotational strength and oblique definition." },
    ],
    cardio: {
      title: "Easy Jog Finisher", type: "Treadmill or outside", duration: "15–20 min",
      intensity: "Zone 2 · Conversational", icon: "footprints",
      notes: "Bonus aerobic volume — legs are fresh after upper body work. Nose-breathe if you can. Push for 20 min if you have the energy.",
    },
  },
  {
    id: "d3",
    name: "Day 3 · Pull & Back",
    short: "Pull",
    duration: "55–60 min + cardio",
    summary: "Lats, mid-back, biceps.",
    exercises: [
      { name: "Lat Pulldown (wide grip)", sets: 4, reps: "8–10", rest: "90s",
        notes: "Lean back ~15°. Drive elbows down and back, bar to upper chest. Brief pause at the bottom." },
      { name: "Single-Arm DB Row", sets: 3, reps: "10 / side", rest: "60s",
        notes: "Knee on bench, flat back. Pull the DB to the hip — not the chest. Squeeze the lat, don't shrug." },
      { name: "Cable Seated Row (close grip)", sets: 3, reps: "12", rest: "60s",
        notes: "Tall chest, pull handle to lower ribs. Drive elbows back and squeeze the mid-back at the end of every rep." },
      { name: "Straight-Arm Cable Pulldown", sets: 3, reps: "12", rest: "60s",
        notes: "Standing, slight hinge, arms straight. Drive bar down to thighs in an arc. Pure lat isolation." },
      { name: "DB Hammer Curl", sets: 3, reps: "10 / side", rest: "45s",
        notes: "Neutral grip — palms facing each other. Builds the brachialis, the muscle that gives the arm shape from the side." },
      { name: "DB Bicep Curl (alternating)", sets: 3, reps: "10 / side", rest: "45s",
        notes: "Slight supination at the top. No swinging — controlled tempo, full range." },
    ],
    cardio: {
      title: "Easy Jog Finisher", type: "Treadmill or outside", duration: "15–20 min",
      intensity: "Zone 2 · Conversational", icon: "footprints",
      notes: "Same as Day 2. Easy aerobic flush after pulling work — keep it conversational the whole way.",
    },
  },
  {
    id: "d4",
    name: "Day 4 · Posterior",
    short: "Hams",
    duration: "55–60 min + cardio",
    summary: "Hamstrings, glute med, deep core.",
    exercises: [
      { name: "Single-Leg DB RDL", sets: 4, reps: "8 / side", rest: "75s",
        notes: "DB in opposite hand to working leg. Hinge slow, back leg straight, hips square. Balance is part of the work." },
      { name: "DB Bulgarian Split Squat (glute bias)", sets: 3, reps: "8–10 / side", rest: "75s",
        notes: "Front foot further forward than usual, slight torso lean. Sit back into the glute — not down into the quad." },
      { name: "DB Sumo Deadlift", sets: 3, reps: "10", rest: "75s",
        notes: "Wide stance, toes out, single heavy DB held between the legs. Drive through heels, squeeze glutes hard at the top." },
      { name: "DB Back Extension (on bench)", sets: 3, reps: "12", rest: "60s",
        notes: "Light DB at chest. Round upper back to start, extend by squeezing glutes — not by hyperextending the lower back." },
      { name: "Standing DB Calf Raise", sets: 3, reps: "15", rest: "45s",
        notes: "Slow up. 2-second pause at the top. Slow down. Strong calves = injury-resistant runner." },
      { name: "Side Plank (with reach)", sets: 3, reps: "10 / side", rest: "45s",
        notes: "Top arm threads under and reaches up. Hits obliques and glute med at once." },
    ],
    cardio: {
      title: "Recovery Cardio", type: "Bike or Walk", duration: "10 min",
      intensity: "Very easy", icon: "bike",
      notes: "Pure recovery. Posterior chain is cooked — move blood through the legs without adding fatigue. Easy bike or flat walk only.",
    },
  },
];

const week = [
  { day: "Mon", session: "Day 1 · Glutes", type: "lift", addOn: "+ 10 min cardio" },
  { day: "Tue", session: "Easy run · 5–8 km", type: "run" },
  { day: "Wed", session: "Day 2 · Push", type: "lift", addOn: "+ 15–20 min jog" },
  { day: "Thu", session: "Rest", type: "rest" },
  { day: "Fri", session: "Day 3 · Pull", type: "lift", addOn: "+ 15–20 min jog" },
  { day: "Sat", session: "Day 4 · Posterior", type: "lift", addOn: "+ 10 min cardio" },
  { day: "Sun", session: "Long run · 8–12 km", type: "run" },
];

const runs = [
  { name: "Easy Run", day: "Tuesday", duration: "35–45 min", distance: "5–8 km",
    pace: "Conversational", hr: "Zone 2 · ~115–135 bpm",
    cue: "Talk in full sentences. Nose-breathe if you can." },
  { name: "Long Easy", day: "Sunday", duration: "60–75 min", distance: "8–12 km",
    pace: "Same as Tuesday", hr: "Zone 2 · same range",
    cue: "Build distance over weeks, never speed." },
];

const macros = { calories: 1880, protein: 120, carbs: 225, fat: 55, bmr: 1303, tdee: 2085 };

const fodmapSafe = [
  { cat: "Protein", items: "Chicken, fish, eggs, firm tofu, lactose-free Greek yogurt, hard cheeses" },
  { cat: "Carbs", items: "Rice, oats, quinoa, potatoes, sweet potato, GF pasta, sourdough spelt" },
  { cat: "Vegetables", items: "Carrots, zucchini, red peppers, spinach, green beans, eggplant, bok choy" },
  { cat: "Fruit", items: "Firm bananas, berries, oranges, kiwi, grapes" },
  { cat: "Fats", items: "Olive oil, avocado (small), peanuts, walnuts, macadamias" },
];

const fodmapAvoid = [
  { cat: "High FODMAP", items: "Garlic, onion, wheat (large servings), beans, lentils, chickpeas" },
  { cat: "Fruit", items: "Apples, pears, mangoes, watermelon, cherries, very ripe bananas" },
  { cat: "Vegetables", items: "Cauliflower, mushrooms, asparagus, leeks" },
  { cat: "Other", items: "Regular dairy, honey, agave, cashews, pistachios" },
];

const TODAY_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];

const proteinKcal = macros.protein * 4;
const carbsKcal = macros.carbs * 4;
const fatKcal = macros.fat * 9;
const totalKcal = proteinKcal + carbsKcal + fatKcal;
const proteinPct = Math.round((proteinKcal / totalKcal) * 100);
const carbsPct = Math.round((carbsKcal / totalKcal) * 100);
const fatPct = 100 - proteinPct - carbsPct;

// ────────────────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────────────────
const TabButton = ({ active, onClick, icon: Icon, label, color }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 transition-colors ${
      active ? color : "text-slate-400 hover:text-slate-600"
    }`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className={`text-xs ${active ? "font-bold" : "font-medium"}`}>{label}</span>
  </button>
);

const SetLogger = ({ exercise, sets, onChange, onClear }) => (
  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
    <div className="flex items-center justify-between mb-3">
      <div className="text-xs font-bold uppercase tracking-wider text-orange-800">Log your sets</div>
      {sets && sets.length > 0 && (
        <button onClick={onClear} className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-white">
          <RotateCcw size={11} strokeWidth={2.2} /> Clear
        </button>
      )}
    </div>

    <div className="grid grid-cols-[40px_1fr_1fr] gap-3 mb-2 px-1">
      <div></div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">
        {exercise.timeBased ? "Sec" : "Weight (kg)"}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Reps</div>
    </div>

    <div className="space-y-2">
      {Array.from({ length: exercise.sets }).map((_, idx) => {
        const setData = sets?.[idx] || {};
        return (
          <div key={idx} className="grid grid-cols-[40px_1fr_1fr] gap-3 items-center">
            <div className="text-sm font-bold text-orange-700">{idx + 1}</div>
            <input
              type="number" step="0.5" inputMode="decimal"
              value={setData.weight ?? ""}
              onChange={(e) => onChange(idx, "weight", e.target.value)}
              placeholder={exercise.timeBased ? "—" : "kg"}
              className="h-11 bg-white border border-orange-300 rounded-md text-center font-semibold text-slate-900 text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-300 placeholder:font-normal tabular-nums"
              aria-label={`Set ${idx + 1} weight`}
            />
            <input
              type="number" inputMode="numeric"
              value={setData.reps ?? ""}
              onChange={(e) => onChange(idx, "reps", e.target.value)}
              placeholder="reps"
              className="h-11 bg-white border border-orange-300 rounded-md text-center font-semibold text-slate-900 text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-300 placeholder:font-normal tabular-nums"
              aria-label={`Set ${idx + 1} reps`}
            />
          </div>
        );
      })}
    </div>

    <div className="mt-3 text-[11px] text-slate-500">
      Target: {exercise.sets} × {exercise.reps} · {exercise.rest} rest
    </div>
  </div>
);

const ExerciseCard = ({ exercise, isDone, isOpen, sets, onToggleDone, onToggleOpen, onUpdateSet, onClearSets }) => {
  const setsLogged = sets?.filter((s) => s?.weight || s?.reps).length || 0;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button onClick={onToggleOpen} className="w-full text-left active:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3 p-4">
          <div
            onClick={(e) => { e.stopPropagation(); onToggleDone(); }}
            className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
              isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white hover:border-orange-400"
            }`}
            role="checkbox"
            aria-checked={isDone}
          >
            {isDone && <Check size={15} strokeWidth={3} />}
          </div>

          <div className="flex-1 min-w-0">
            <div className={`font-semibold text-slate-900 leading-snug ${isDone ? "line-through text-slate-400" : ""}`}>
              {exercise.name}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500">{exercise.sets} × {exercise.reps}</span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-slate-500">{exercise.rest}</span>
              {setsLogged > 0 && (
                <>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs text-orange-600 font-bold">{setsLogged}/{exercise.sets} logged</span>
                </>
              )}
            </div>
          </div>

          <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 p-4 space-y-4">
          <SetLogger exercise={exercise} sets={sets} onChange={onUpdateSet} onClear={onClearSets} />

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className="text-amber-700" />
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Form</div>
            </div>
            <div className="text-sm text-slate-800 leading-relaxed">{exercise.notes}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const CardioCard = ({ cardio, isDone, isOpen, onToggleDone, onToggleOpen }) => {
  const Icon = cardio.icon === "bike" ? Bike : Footprints;
  return (
    <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl border-2 border-cyan-200 shadow-sm overflow-hidden">
      <button onClick={onToggleOpen} className="w-full text-left active:bg-cyan-100/40 transition-colors">
        <div className="flex items-center gap-3 p-4">
          <div
            onClick={(e) => { e.stopPropagation(); onToggleDone(); }}
            className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
              isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-cyan-400 bg-white hover:border-cyan-600"
            }`}
            role="checkbox"
            aria-checked={isDone}
          >
            {isDone && <Check size={15} strokeWidth={3} />}
          </div>

          <div className="w-9 h-9 rounded-full bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-200">
            <Icon size={18} strokeWidth={2.2} />
          </div>

          <div className="flex-1 min-w-0">
            <div className={`font-bold text-slate-900 leading-snug ${isDone ? "line-through text-slate-400" : ""}`}>{cardio.title}</div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="text-xs font-semibold text-cyan-700">{cardio.duration}</span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-slate-600">{cardio.intensity}</span>
            </div>
          </div>

          <ChevronDown size={18} className={`shrink-0 text-cyan-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-cyan-200 p-4 bg-white/60">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white rounded-lg p-3 border border-cyan-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Type</div>
              <div className="text-sm font-semibold text-slate-900">{cardio.type}</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-cyan-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Duration</div>
              <div className="text-sm font-semibold text-slate-900">{cardio.duration}</div>
            </div>
          </div>
          <div className="text-sm text-slate-700 leading-relaxed">{cardio.notes}</div>
        </div>
      )}
    </div>
  );
};

const RunCard = ({ run }) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-5">
    <div className="flex items-baseline justify-between mb-3">
      <h3 className="text-lg font-bold text-slate-900">{run.name}</h3>
      <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">{run.day}</span>
    </div>

    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-cyan-50 rounded-lg p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 mb-1">Time</div>
        <div className="text-base font-bold text-slate-900">{run.duration}</div>
      </div>
      <div className="bg-cyan-50 rounded-lg p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 mb-1">Distance</div>
        <div className="text-base font-bold text-slate-900">{run.distance}</div>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0 w-12 mt-0.5">Pace</span>
        <span className="text-sm text-slate-700">{run.pace}</span>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0 w-12 mt-0.5">HR</span>
        <span className="text-sm text-slate-700">{run.hr}</span>
      </div>
    </div>

    <div className="mt-4 pt-3 border-t border-slate-100 text-sm text-slate-600 italic">"{run.cue}"</div>
  </div>
);

// ────────────────────────────────────────────────────────────
// Main app
// ────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("train");
  const [activeDayId, setActiveDayId] = useState("d1");
  const [logs, setLogs] = useState({});
  const [completed, setCompleted] = useState({});
  const [openExercise, setOpenExercise] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s = loadState();
    setLogs(s.logs || {});
    setCompleted(s.completed || {});
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveState({ logs, completed });
  }, [logs, completed, loaded]);

  const day = days.find((d) => d.id === activeDayId);

  const updateSet = useCallback((exKey, setIdx, field, value) => {
    setLogs((prev) => {
      const exSets = [...(prev[exKey] || [])];
      while (exSets.length <= setIdx) exSets.push({});
      exSets[setIdx] = { ...exSets[setIdx], [field]: value };
      return { ...prev, [exKey]: exSets };
    });
  }, []);

  const clearExercise = useCallback((exKey) => {
    setLogs((prev) => {
      const updated = { ...prev };
      delete updated[exKey];
      return updated;
    });
  }, []);

  const toggleDone = useCallback((key) => {
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const dayProgress = (d) => {
    const ex = d.exercises.filter((_, i) => completed[`${d.id}-${i}`]).length;
    const card = completed[`${d.id}-cardio`] ? 1 : 0;
    return ex + card;
  };
  const dayTotalItems = (d) => d.exercises.length + 1;
  const dayDone = (d) => dayProgress(d) === dayTotalItems(d);

  return (
    <div className="min-h-screen relative">
      <div className="app-bg fixed inset-0 -z-10" />
      <div className="dot-pattern fixed inset-0 -z-10 opacity-60" />

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[8%] -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-orange-300 to-pink-300 opacity-25 blur-3xl" />
        <div className="absolute top-[35%] -right-28 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-300 to-blue-300 opacity-20 blur-3xl" />
        <div className="absolute bottom-[25%] left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-violet-300 to-fuchsia-300 opacity-20 blur-3xl" />
        <div className="absolute bottom-[5%] -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-emerald-300 to-teal-300 opacity-20 blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto min-h-screen pb-24 relative">
        <header className="bg-white/85 backdrop-blur-md border-b border-orange-100 px-5 py-4 sticky top-0 z-20 shadow-sm">
          <div className={`absolute top-0 left-0 right-0 h-1 ${
            tab === "train" ? "bg-gradient-to-r from-orange-500 to-rose-500" :
            tab === "run" ? "bg-gradient-to-r from-cyan-500 to-blue-500" :
            tab === "eat" ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
            "bg-gradient-to-r from-violet-500 to-fuchsia-500"
          }`} />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Mascot size={52} />
              <div>
                <h1 className="font-brand text-3xl bg-gradient-to-br from-orange-600 via-rose-500 to-violet-600 bg-clip-text text-transparent leading-none mb-0.5">
                  Sister Iron
                </h1>
                <p className="text-[11px] text-slate-600 font-medium">Emma · 4-day recomp · phase 1</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Today</div>
              <div className="text-sm font-bold text-slate-900">
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </div>
            </div>
          </div>
        </header>

        {tab === "train" && (
          <div>
            <div className="bg-white/70 backdrop-blur-sm border-b border-orange-100 px-5 pt-4 pb-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">Choose a day</div>
              <div className="grid grid-cols-4 gap-2">
                {days.map((d) => {
                  const isActive = activeDayId === d.id;
                  const progress = dayProgress(d);
                  const total = dayTotalItems(d);
                  const done = dayDone(d);
                  return (
                    <button
                      key={d.id}
                      onClick={() => { setActiveDayId(d.id); setOpenExercise(null); }}
                      className={`relative py-3 px-2 rounded-xl border-2 transition-all ${
                        isActive
                          ? "bg-gradient-to-br from-orange-500 to-rose-500 border-orange-500 text-white shadow-lg shadow-orange-300/50 scale-[1.02]"
                          : "bg-white border-slate-200 text-slate-700 hover:border-orange-300"
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-0.5">Day {d.id.replace("d", "")}</div>
                      <div className="text-sm font-extrabold">{d.short}</div>
                      <div className={`text-[10px] mt-1 font-medium ${isActive ? "opacity-90" : "text-slate-500"}`}>{progress}/{total}</div>
                      {done && <div className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full ring-2 ${isActive ? "bg-emerald-300 ring-white/30" : "bg-emerald-500 ring-white"}`} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-5 py-5">
              <div className="mb-4">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{day.name}</h2>
                <p className="text-sm text-slate-600">{day.summary}</p>
                <div className="flex items-center gap-3 mt-3 text-xs">
                  <span className="text-slate-500">Duration <span className="font-bold text-slate-700">{day.duration}</span></span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500"><span className="font-bold text-emerald-600">{dayProgress(day)}</span>/{dayTotalItems(day)} done</span>
                </div>
              </div>

              <div className="mb-5 h-2 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500" style={{ width: `${(dayProgress(day) / dayTotalItems(day)) * 100}%` }} />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Dumbbell size={14} className="text-orange-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Strength</span>
                <div className="flex-1 h-px bg-slate-300" />
              </div>

              <div className="space-y-2.5 mb-6">
                {day.exercises.map((ex, i) => {
                  const key = `${day.id}-${i}`;
                  const exKey = `${day.id}:${i}`;
                  return (
                    <ExerciseCard
                      key={key}
                      exercise={ex}
                      isDone={!!completed[key]}
                      isOpen={openExercise === key}
                      sets={logs[exKey]}
                      onToggleDone={() => toggleDone(key)}
                      onToggleOpen={() => setOpenExercise(openExercise === key ? null : key)}
                      onUpdateSet={(setIdx, field, value) => updateSet(exKey, setIdx, field, value)}
                      onClearSets={() => clearExercise(exKey)}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-cyan-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Cardio Finisher</span>
                <div className="flex-1 h-px bg-slate-300" />
              </div>

              <CardioCard
                cardio={day.cardio}
                isDone={!!completed[`${day.id}-cardio`]}
                isOpen={openExercise === `${day.id}-cardio`}
                onToggleDone={() => toggleDone(`${day.id}-cardio`)}
                onToggleOpen={() => setOpenExercise(openExercise === `${day.id}-cardio` ? null : `${day.id}-cardio`)}
              />
            </div>
          </div>
        )}

        {tab === "run" && (
          <div className="px-5 py-5">
            <div className="mb-5">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">The Miles</h2>
              <p className="text-sm text-slate-600">Two structured runs a week. All easy, all aerobic.</p>
            </div>

            <div className="space-y-3 mb-5">{runs.map((r) => <RunCard key={r.name} run={r} />)}</div>

            <div className="bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-200 rounded-xl p-4 mb-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-md shadow-cyan-200"><Plus size={14} strokeWidth={3} /></div>
                <div className="text-sm font-bold text-cyan-900">Cardio finishers on lift days</div>
              </div>
              <div className="text-sm text-slate-700">Each strength day ends with a short cardio finisher: 10 min recovery on lower body days, 15–20 min easy jogging on upper body days. See the Train tab for each day's specific cardio.</div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm p-5 mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-700 mb-3">Run rules</h3>
              <ol className="space-y-3 list-decimal list-inside marker:text-cyan-500 marker:font-bold">
                <li className="text-sm text-slate-700 leading-relaxed"><span className="font-bold text-slate-900">All easy. Always.</span> No tempo, no intervals. Strength is the hard work.</li>
                <li className="text-sm text-slate-700 leading-relaxed"><span className="font-bold text-slate-900">Slow before fast.</span> Real fitness comes from accumulated easy miles. If you can't talk, slow down.</li>
                <li className="text-sm text-slate-700 leading-relaxed"><span className="font-bold text-slate-900">The cycle is the canary.</span> If your period shifts or sleep tanks, drop a run that week and eat more.</li>
              </ol>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-200 bg-slate-50"><h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Protocol</h3></div>
              <div className="divide-y divide-slate-100">
                <div className="px-5 py-3"><div className="text-xs font-bold uppercase tracking-wider text-cyan-600 mb-1">Warm-up</div><div className="text-sm text-slate-700">5 min walk → leg swings, walking lunges, ankle circles → 2 min easy jog ramp-up.</div></div>
                <div className="px-5 py-3"><div className="text-xs font-bold uppercase tracking-wider text-cyan-600 mb-1">Cool-down</div><div className="text-sm text-slate-700">3 min walk → 30s holds: hip flexors, calves, hamstrings.</div></div>
                <div className="px-5 py-3"><div className="text-xs font-bold uppercase tracking-wider text-cyan-600 mb-1">Progression</div><div className="text-sm text-slate-700">Build distance from the bottom of each range to the top over 4–6 weeks. Don't add to time AND distance in the same week.</div></div>
              </div>
            </div>
          </div>
        )}

        {tab === "eat" && (
          <div className="px-5 py-5">
            <div className="mb-5">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">The Table</h2>
              <p className="text-sm text-slate-600">Recomp targets · low FODMAP friendly</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-2xl p-6 mb-4 text-center shadow-xl shadow-emerald-200/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">Daily target</div>
                <div className="text-5xl font-extrabold tabular-nums">{macros.calories.toLocaleString()}</div>
                <div className="text-sm opacity-95 mt-1">calories per day</div>
                <div className="text-xs opacity-80 mt-3 pt-3 border-t border-white/20">BMR {macros.bmr} · TDEE {macros.tdee} · 10% deficit · tuned for cardio finishers</div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm p-5 mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 mb-4">Macros</h3>
              <div className="flex h-3 rounded-full overflow-hidden mb-4 shadow-inner">
                <div className="bg-rose-500" style={{ width: `${proteinPct}%` }}></div>
                <div className="bg-amber-500" style={{ width: `${carbsPct}%` }}></div>
                <div className="bg-violet-500" style={{ width: `${fatPct}%` }}></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="flex items-center justify-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Protein</span></div>
                  <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{macros.protein}g</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{proteinKcal} kcal · {proteinPct}%</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-center justify-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Carbs</span></div>
                  <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{macros.carbs}g</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{carbsKcal} kcal · {carbsPct}%</div>
                </div>
                <div className="text-center p-3 bg-violet-50 rounded-xl border border-violet-100">
                  <div className="flex items-center justify-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full bg-violet-500" /><span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">Fat</span></div>
                  <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{macros.fat}g</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{fatKcal} kcal · {fatPct}%</div>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-3">
              <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200"><Check size={14} strokeWidth={3} /></div>
                <h3 className="font-bold text-slate-900">Eat freely</h3>
                <span className="text-xs text-slate-500">· low FODMAP</span>
              </div>
              <div className="divide-y divide-slate-100">
                {fodmapSafe.map((c) => (
                  <div key={c.cat} className="px-5 py-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">{c.cat}</div>
                    <div className="text-sm text-slate-800 leading-relaxed">{c.items}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-5">
              <div className="px-5 py-3 bg-rose-50 border-b border-rose-100 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-200"><Minus size={14} strokeWidth={3} /></div>
                <h3 className="font-bold text-slate-900">Limit or avoid</h3>
                <span className="text-xs text-slate-500">· high FODMAP</span>
              </div>
              <div className="divide-y divide-slate-100">
                {fodmapAvoid.map((c) => (
                  <div key={c.cat} className="px-5 py-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-1">{c.cat}</div>
                    <div className="text-sm text-slate-800 leading-relaxed">{c.items}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 flex gap-3 shadow-sm">
              <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-slate-800"><span className="font-bold">Pro tip:</span> Garlic-infused olive oil gives all the flavor without the FODMAPs — flavor is fat-soluble, FODMAPs are not.</div>
            </div>
          </div>
        )}

        {tab === "week" && (
          <div className="px-5 py-5">
            <div className="mb-5">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">The Week</h2>
              <p className="text-sm text-slate-600">7-day overview</p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {week.map((d, i) => {
                const isToday = d.day === TODAY_LABEL;
                const colorMap = {
                  lift: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
                  run: { bg: "bg-cyan-100", text: "text-cyan-700", dot: "bg-cyan-500" },
                  rest: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
                };
                const c = colorMap[d.type];
                return (
                  <div key={d.day} className={`flex items-center gap-4 px-5 py-4 ${i < week.length - 1 ? "border-b border-slate-100" : ""} ${isToday ? "bg-gradient-to-r from-violet-50 via-fuchsia-50 to-pink-50" : ""}`}>
                    <div className="w-12 text-center">
                      <div className={`text-xs font-bold uppercase tracking-wider ${isToday ? "text-violet-700" : "text-slate-500"}`}>{d.day}</div>
                      {isToday && <div className="text-[9px] font-extrabold uppercase tracking-wider text-violet-600 mt-0.5">Today</div>}
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-sm">{d.session}</div>
                      {d.addOn && <div className="text-xs text-cyan-600 font-medium mt-0.5">{d.addOn}</div>}
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${c.bg} ${c.text}`}>{d.type}</div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm p-3 text-center"><div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Strength</div><div className="text-xl font-extrabold text-orange-600">4 days</div></div>
              <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm p-3 text-center"><div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Cardio</div><div className="text-xl font-extrabold text-cyan-600">6 sessions</div></div>
              <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm p-3 text-center"><div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Rest</div><div className="text-xl font-extrabold text-slate-700">1 day</div></div>
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto flex">
          <TabButton active={tab === "train"} onClick={() => setTab("train")} icon={Dumbbell} label="Train" color="text-orange-600" />
          <TabButton active={tab === "run"} onClick={() => setTab("run")} icon={Activity} label="Run" color="text-cyan-600" />
          <TabButton active={tab === "eat"} onClick={() => setTab("eat")} icon={Apple} label="Eat" color="text-emerald-600" />
          <TabButton active={tab === "week"} onClick={() => setTab("week")} icon={Calendar} label="Week" color="text-violet-600" />
        </div>
      </nav>
    </div>
  );
}

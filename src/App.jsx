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

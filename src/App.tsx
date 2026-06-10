import React, { useState, useEffect } from "react";
import { 
  Dumbbell, 
  Trophy, 
  Calendar, 
  Plus, 
  Trash2, 
  Clock, 
  Save, 
  CheckCircle, 
  TrendingUp,
  RotateCcw,
  Activity
} from "lucide-react";
import APFTCalculator from "./components/APFTCalculator";
import { APFTRecord } from "./types";

interface WorkoutExercise {
  name: string;
  weightLbs: number;
  sets: number;
  reps: number;
}

interface UserCustomWorkout {
  id: string;
  date: string;
  durationMinutes: number;
  notes: string;
  exercises: WorkoutExercise[];
}

export default function App() {
  // Navigation tabs: simple & utility-first
  const [activeTab, setActiveTab] = useState<"logger" | "apft" | "history">("logger");

  // Local storage lists
  const [loggedWorkouts, setLoggedWorkouts] = useState<UserCustomWorkout[]>([]);
  const [savedAPFTRecords, setSavedAPFTRecords] = useState<APFTRecord[]>([]);

  // Logger Form state
  const [duration, setDuration] = useState<number>(30);
  const [workoutNotes, setWorkoutNotes] = useState<string>("");
  const [exercises, setExercises] = useState<WorkoutExercise[]>([
    { name: "Weighted Vest Pull-ups", weightLbs: 30, sets: 4, reps: 8 },
    { name: "Dual Dumbbell Floor Press", weightLbs: 50, sets: 4, reps: 12 }
  ]);

  // Loading existing data
  useEffect(() => {
    const workouts = localStorage.getItem("custom_workout_logs");
    if (workouts) {
      try { setLoggedWorkouts(JSON.parse(workouts)); } catch (e) {}
    }
    const apft = localStorage.getItem("apft_records");
    if (apft) {
      try { setSavedAPFTRecords(JSON.parse(apft)); } catch (e) {}
    }
  }, []);

  // Quick template injects for 25lb DBs, 30lb Vest, Pull-up Bar
  const quickPickTemplates = [
    { name: "Weighted Pull-ups", weightLbs: 30, sets: 4, reps: 8 },
    { name: "Bodyweight Pull-ups (Strict)", weightLbs: 0, sets: 4, reps: 10 },
    { name: "Dual DB Floor Press (2x25lb)", weightLbs: 50, sets: 4, reps: 12 },
    { name: "Weighted Vest Pushups", weightLbs: 30, sets: 4, reps: 15 },
    { name: "DB Goblet Squats (with Vest)", weightLbs: 55, sets: 4, reps: 12 },
    { name: "DB Standing Shoulder Press", weightLbs: 50, sets: 3, reps: 10 },
    { name: "Weighted Vest Sit-ups", weightLbs: 30, sets: 3, reps: 25 },
    { name: "APFT Push-up Pace Set", weightLbs: 0, sets: 1, reps: 50 }
  ];

  const handleAddExerciseRow = () => {
    setExercises([...exercises, { name: "", weightLbs: 0, sets: 3, reps: 10 }]);
  };

  const handleUpdateRow = (index: number, field: keyof WorkoutExercise, value: any) => {
    const updated = [...exercises];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setExercises(updated);
  };

  const handleRemoveRow = (index: number) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
  };

  const handleQuickInject = (template: typeof quickPickTemplates[0]) => {
    setExercises([...exercises, { ...template }]);
  };

  const handleLogWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (exercises.length === 0) {
      alert("Please add at least one exercise to your log.");
      return;
    }

    // Validate entries
    const invalid = exercises.some(ex => !ex.name.trim());
    if (invalid) {
      alert("Please specify a name for all exercises.");
      return;
    }

    const newLog: UserCustomWorkout = {
      id: "custom_work_" + Date.now(),
      date: new Date().toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      durationMinutes: Number(duration) || 30,
      notes: workoutNotes.trim() || "Custom workout finalized.",
      exercises: [...exercises]
    };

    const updated = [newLog, ...loggedWorkouts];
    setLoggedWorkouts(updated);
    localStorage.setItem("custom_workout_logs", JSON.stringify(updated));

    // Clear and notify
    setWorkoutNotes("");
    setDuration(30);
    // Reset to defaults
    setExercises([
      { name: "Weighted Vest Pull-ups", weightLbs: 30, sets: 4, reps: 8 }
    ]);
    alert("Workout Saved Successfully!");
  };

  const handleDeleteWorkout = (id: string) => {
    if (confirm("Delete this logged session from history?")) {
      const filtered = loggedWorkouts.filter(w => w.id !== id);
      setLoggedWorkouts(filtered);
      localStorage.setItem("custom_workout_logs", JSON.stringify(filtered));
    }
  };

  const handleSaveAPFT = (record: APFTRecord) => {
    const updated = [record, ...savedAPFTRecords];
    setSavedAPFTRecords(updated);
    localStorage.setItem("apft_records", JSON.stringify(updated));
  };

  const handleDeleteAPFT = (id: string) => {
    const filtered = savedAPFTRecords.filter(r => r.id !== id);
    setSavedAPFTRecords(filtered);
    localStorage.setItem("apft_records", JSON.stringify(filtered));
  };

  return (
    <div className="min-h-screen bg-[#070b11] text-gray-100 font-sans selection:bg-[#a3b18a]/30 selection:text-white">
      
      {/* Top clean header strip */}
      <header className="border-b border-[#1b2533] bg-[#0c121c] py-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#182333] p-2 rounded border border-[#2c3d54]">
              <Activity className="w-5 h-5 text-[#a3b18a]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white uppercase">
                TACTICAL FITNESS LOG
              </h1>
              <p className="text-[11px] text-gray-400">
                Equipment Load: 2x25lb dumbbells, 30lb weighted vest, pull-up bar
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-4 text-xs font-mono">
            <div className="bg-[#121924] px-3 py-1.5 rounded border border-[#1e2a3b]">
              <span className="text-gray-400 block text-[9px] uppercase">Workouts Logged</span>
              <strong className="text-orange-400 text-sm">{loggedWorkouts.length} Sessions</strong>
            </div>
            <div className="bg-[#121924] px-3 py-1.5 rounded border border-[#1e2a3b]">
              <span className="text-gray-400 block text-[9px] uppercase">Best APFT Score</span>
              <strong className="text-[#a3b18a] text-sm">
                {savedAPFTRecords.length > 0 ? Math.max(...savedAPFTRecords.map(r => r.totalScore)) : "—"} / 300
              </strong>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-[#0c121c] border-b border-[#1b2533]">
        <div className="max-w-6xl mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab("logger")}
            className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "logger" 
                ? "border-[#a3b18a] text-white bg-[#121922]" 
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Dumbbell className="w-4 h-4 text-[#a3b18a]" />
            QUICK LOGGER
          </button>

          <button
            onClick={() => setActiveTab("apft")}
            className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "apft" 
                ? "border-[#a3b18a] text-white bg-[#121922]" 
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
            APFT SCORE CALCULATOR
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "history" 
                ? "border-[#a3b18a] text-white bg-[#121922]" 
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
            COMBAT LOG HISTORY ({loggedWorkouts.length})
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* TAB 1: LOGGER */}
        {activeTab === "logger" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* INPUT WORKOUT LOG FORM (8 columns) */}
            <form onSubmit={handleLogWorkout} className="lg:col-span-8 bg-[#0f1622] rounded-xl border border-[#212f44] p-6 shadow-xl space-y-6">
              <div className="border-b border-[#212f44] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-tight">LOG YOUR TRAINING SESSION</h2>
                  <p className="text-xs text-gray-400">Record your movements, exact loads, sets, and rep volumes manually below.</p>
                </div>
                
                {/* Duration input */}
                <div className="flex items-center gap-2 bg-[#172233] px-3 py-1.5 border border-[#283952] rounded-lg">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <label className="text-[10px] font-mono text-gray-300 uppercase shrink-0">Duration:</label>
                  <input 
                    type="number" 
                    value={duration} 
                    onChange={(e) => setDuration(Math.max(0, Number(e.target.value)))}
                    className="w-12 text-center text-xs font-mono font-bold bg-[#0f1622] text-yellow-400 focus:outline-none border-b border-gray-600 focus:border-[#a3b18a]"
                    required
                  />
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Min</span>
                </div>
              </div>

              {/* Dynamic exercises table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pl-1">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">EXERCISES IN THIS SESSION:</h3>
                  <button
                    type="button"
                    onClick={handleAddExerciseRow}
                    className="bg-[#24354e] hover:bg-[#2d4261] text-xs font-mono px-3 py-1.5 rounded text-gray-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    ADD EXERCISE ROW
                  </button>
                </div>

                <div className="space-y-2">
                  {exercises.map((ex, idx) => (
                    <div key={idx} className="bg-[#151f2e] p-3 rounded-lg border border-[#24344d] flex flex-col md:flex-row gap-3 items-center">
                      
                      {/* Name / Description */}
                      <div className="w-full md:flex-1">
                        <label className="block md:hidden text-[9px] font-mono text-gray-400 uppercase mb-1">Exercise Name</label>
                        <input
                          type="text"
                          value={ex.name}
                          onChange={(e) => handleUpdateRow(idx, "name", e.target.value)}
                          placeholder="e.g. Weighted Pull-ups, DB Floor Press"
                          className="w-full bg-[#0d1521] border border-[#2a3c54] rounded p-2 text-xs focus:ring-1 focus:ring-[#a3b18a] focus:outline-none placeholder:text-gray-600 text-gray-100"
                          required
                        />
                      </div>

                      {/* Weight lbs */}
                      <div className="w-full md:w-32 flex flex-col">
                        <span className="text-[9px] font-mono text-gray-400 uppercase mb-1 md:text-center">Weight (lbs)</span>
                        <input
                          type="number"
                          value={ex.weightLbs}
                          onChange={(e) => handleUpdateRow(idx, "weightLbs", Math.max(0, Number(e.target.value)))}
                          className="w-full bg-[#0d1521] border border-[#2a3c54] rounded p-2 text-xs font-mono text-center text-orange-300 focus:outline-none focus:border-[#a3b18a]"
                          min="0"
                        />
                      </div>

                      {/* Sets */}
                      <div className="w-full md:w-20 flex flex-col">
                        <span className="text-[9px] font-mono text-gray-400 uppercase mb-1 md:text-center">Sets</span>
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => handleUpdateRow(idx, "sets", Math.max(1, Number(e.target.value)))}
                          className="w-full bg-[#0d1521] border border-[#2a3c54] rounded p-2 text-xs font-mono text-center focus:outline-none focus:border-[#a3b18a]"
                          min="1"
                        />
                      </div>

                      {/* Reps */}
                      <div className="w-full md:w-20 flex flex-col">
                        <span className="text-[9px] font-mono text-gray-400 uppercase mb-1 md:text-center">Reps</span>
                        <input
                          type="number"
                          value={ex.reps}
                          onChange={(e) => handleUpdateRow(idx, "reps", Math.max(1, Number(e.target.value)))}
                          className="w-full bg-[#0d1521] border border-[#2a3c54] rounded p-2 text-xs font-mono text-center focus:outline-none focus:border-[#a3b18a]"
                          min="1"
                        />
                      </div>

                      {/* Remove row button */}
                      <div className="self-end md:self-auto pt-2 md:pt-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          className="text-gray-500 hover:text-red-400 p-2 rounded hover:bg-[#202c3d]/60 cursor-pointer"
                          title="Remove row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-gray-300 uppercase">Workout Notes / Performance Feedback:</label>
                <textarea
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="e.g. Managed full 30lb vest on pull ups. Dumbbells are feeling slightly light on presses, used slower eccentric control."
                  className="w-full h-20 bg-[#0d1521] border border-[#23334a] rounded-lg p-3 text-xs text-gray-200 focus:ring-1 focus:ring-[#a3b18a] focus:outline-none placeholder:text-gray-600 resize-none font-sans"
                ></textarea>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full bg-[#a3b18a] hover:bg-[#b5c79b] text-[#070b11] font-mono font-bold py-3 px-5 rounded-lg text-xs tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                SAVE WORKOUT SESSION TO COMBAT HISTORY
              </button>
            </form>

            {/* QUICK PRESETS INJECTOR BAR (4 columns) */}
            <div className="lg:col-span-4 bg-[#0f1622] rounded-xl border border-[#212f44] p-5 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 border-b border-[#212f44] pb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#a3b18a]" />
                  INSTANT APPARATUS PRESETS
                </h3>
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                  Have limited equipment? Tap any of these quick preset builders to instantly inject rows for your 25lb dumbbells, weighted vest, or pull-up bar:
                </p>

                <div className="space-y-2.5 mt-4">
                  {quickPickTemplates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickInject(tpl)}
                      className="w-full text-left bg-[#151f2e] hover:bg-[#1a2638] p-2.5 rounded border border-[#25364e] hover:border-[#a3b18a]/50 transition-all text-xs flex justify-between items-center cursor-pointer group"
                    >
                      <div>
                        <div className="font-bold text-gray-200 group-hover:text-white transition-colors">
                          {tpl.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {tpl.sets}x{tpl.reps} @ {tpl.weightLbs > 0 ? `${tpl.weightLbs} lbs` : "Bodyweight"}
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-[#a3b18a] font-bold">
                        Add +
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#1a1211] border border-red-900/40 p-4 rounded-lg mt-5">
                <span className="text-[10px] font-mono font-bold text-red-400 block uppercase mb-1">Bulking Intensity Cue:</span>
                <p className="text-[11px] text-gray-300 leading-relaxed leading-normal">
                  Since you own two 25lb dumbbells, you must trigger hypertrophy by maximizing **Time Under Tension**. Aim for 3-4 seconds during the negative phase of your reps. Let's grow!
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: APFT SCORE CALCULATOR */}
        {activeTab === "apft" && (
          <div className="animate-[fadeIn_0.15s_ease-out]">
            <APFTCalculator 
              onSaveRecord={handleSaveAPFT}
              savedRecords={savedAPFTRecords}
              onDeleteRecord={handleDeleteAPFT}
            />
          </div>
        )}

        {/* TAB 3: HISTORY LIST */}
        {activeTab === "history" && (
          <div className="bg-[#0f1622] rounded-xl border border-[#212f44] p-6 shadow-xl space-y-6">
            <div className="border-b border-[#212f44] pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">Logged Session Archives</h2>
                <p className="text-xs text-gray-400">Review your past resistance sessions, load ranges, and physical metrics.</p>
              </div>

              {loggedWorkouts.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete ALL logged custom workouts?")) {
                      setLoggedWorkouts([]);
                      localStorage.removeItem("custom_workout_logs");
                    }
                  }}
                  className="bg-[#241717] hover:bg-[#382020] text-red-400 border border-red-900/30 font-mono font-bold py-1.5 px-3 rounded text-[11px] transition-all cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {loggedWorkouts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Dumbbell className="w-10 h-10 text-gray-600 mx-auto" />
                <h4 className="font-bold text-gray-300">No workout records found.</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Get to work! Head over to the quick logger, configure your sets, and archive your first training session.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {loggedWorkouts.map((wk) => (
                  <div key={wk.id} className="bg-[#151f2e] rounded-lg border border-[#25364e] p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#24344a] pb-3">
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono bg-[#1c2838] px-2 py-0.5 rounded border border-[#2a3c54]">
                          Logged: {wk.date}
                        </span>
                        <h3 className="font-bold text-sm text-[#a3b18a] mt-1.5 flex items-center gap-1.5">
                          💼 Work Session — Duration: {wk.durationMinutes} Min
                        </h3>
                      </div>

                      <button
                        onClick={() => handleDeleteWorkout(wk.id)}
                        className="text-gray-500 hover:text-red-400 text-xs font-mono flex items-center gap-1 bg-[#1a1212] px-2.5 py-1.5 rounded border border-red-950/40 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Trash log
                      </button>
                    </div>

                    {/* Exercises logs Grid table */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wk.exercises.map((ex, exIdx) => (
                        <div key={exIdx} className="bg-[#0e1520] p-3 rounded border border-[#1e2a3b] flex justify-between items-center text-xs font-mono">
                          <div>
                            <span className="font-sans font-bold text-gray-200 block">{ex.name}</span>
                            <span className="text-[10px] text-gray-500">
                              Load Weight: <strong className="text-orange-400">{ex.weightLbs > 0 ? `${ex.weightLbs} lbs` : "Bodyweight"}</strong>
                            </span>
                          </div>

                          <div className="bg-[#182333] px-3 py-1.5 rounded border border-[#27374d] text-center text-xs font-bold text-gray-300">
                            {ex.sets} Sets x {ex.reps} Reps
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Performance notes */}
                    {wk.notes && (
                      <div className="bg-[#0e1520] p-3 rounded text-xs border border-[#1e2a3b] text-gray-300 italic font-sans leading-relaxed">
                        <strong className="text-gray-400 font-mono text-[9px] uppercase tracking-wider block not-italic mb-1">
                          Session Performance Feedback:
                        </strong>
                        "{wk.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#070b11] border-t border-[#111924] mt-16 py-8 text-center text-xs text-gray-500">
        <p className="font-mono">
          TACTICAL DUMBBELL & VEST LOG SYSTEM // ACFT & APFT STANDARDS SECURED
        </p>
      </footer>

    </div>
  );
}

import { useState } from "react";
import { APFTRecord } from "../types";
import { Trophy, HelpCircle, ShieldAlert, CheckCircle2, Medal, Save, Trash2 } from "lucide-react";

interface APFTCalculatorProps {
  onSaveRecord: (record: APFTRecord) => void;
  savedRecords: APFTRecord[];
  onDeleteRecord: (id: string) => void;
}

export default function APFTCalculator({ onSaveRecord, savedRecords, onDeleteRecord }: APFTCalculatorProps) {
  const [ageBracket, setAgeBracket] = useState<"27-31" | "32-36">("27-31");
  const [pushups, setPushups] = useState<number>(45);
  const [situps, setSitups] = useState<number>(50);
  
  // 2-Mile Run represented as minutes and seconds separate sliders
  const [runMinutes, setRunMinutes] = useState<number>(15);
  const [runSeconds, setRunSeconds] = useState<number>(30);

  const totalRunSeconds = runMinutes * 60 + runSeconds;

  // Exact Calculation logic based on standard 31M APFT schedules
  let pushupsScore = 0;
  let situpsScore = 0;
  let runScore = 0;

  if (ageBracket === "27-31") {
    // Pushups
    if (pushups >= 77) pushupsScore = 100;
    else if (pushups < 39) pushupsScore = Math.max(0, Math.round(pushups * (60 / 39)));
    else pushupsScore = Math.round(60 + ((pushups - 39) / (77 - 39)) * 40);

    // Situps
    if (situps >= 82) situpsScore = 100;
    else if (situps < 45) situpsScore = Math.max(0, Math.round(situps * (60 / 45)));
    else situpsScore = Math.round(60 + ((situps - 45) / (82 - 45)) * 40);

    // Run
    if (totalRunSeconds <= 798) runScore = 100; // 13:18
    else if (totalRunSeconds >= 1020) { // 17:00 is passing
      const excess = totalRunSeconds - 1020;
      runScore = Math.max(0, Math.round(60 - (excess / 10))); // subtract points per 10s slower
    } else {
      runScore = Math.round(100 - ((totalRunSeconds - 798) / (1020 - 798)) * 40);
    }
  } else {
    // 32-36 Age Bracket
    // Pushups
    if (pushups >= 73) pushupsScore = 100;
    else if (pushups < 36) pushupsScore = Math.max(0, Math.round(pushups * (60 / 36)));
    else pushupsScore = Math.round(60 + ((pushups - 36) / (73 - 36)) * 40);

    // Situps
    if (situps >= 76) situpsScore = 100;
    else if (situps < 40) situpsScore = Math.max(0, Math.round(situps * (60 / 40)));
    else situpsScore = Math.round(60 + ((situps - 40) / (76 - 40)) * 40);

    // Run
    if (totalRunSeconds <= 828) runScore = 100; // 13:48
    else if (totalRunSeconds >= 1062) { // 17:42 passing
      const excess = totalRunSeconds - 1062;
      runScore = Math.max(0, Math.round(60 - (excess / 10)));
    } else {
      runScore = Math.round(100 - ((totalRunSeconds - 828) / (1062 - 828)) * 40);
    }
  }

  // Double check clamps
  pushupsScore = Math.min(100, Math.max(0, pushupsScore));
  situpsScore = Math.min(100, Math.max(0, situpsScore));
  runScore = Math.min(100, Math.max(0, runScore));

  const totalScore = pushupsScore + situpsScore + runScore;
  
  // Passing APFT requirements: Minimum 60 points in EACH event
  const isPushupPassed = pushupsScore >= 60;
  const isSitupPassed = situpsScore >= 60;
  const isRunPassed = runScore >= 60;
  const isPassed = isPushupPassed && isSitupPassed && isRunPassed;

  // Score levels
  const isAced = totalScore === 300;
  const isGoldLevel = totalScore >= 270 && isPassed;
  const isSilverLevel = totalScore >= 240 && isPassed;

  // Format run seconds
  const formatRunDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSave = () => {
    const record: APFTRecord = {
      id: "apft_" + Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      ageBracket,
      pushups,
      pushupsScore,
      situps,
      situpsScore,
      runTimeSeconds: totalRunSeconds,
      runScore,
      totalScore,
      passed: isPassed
    };
    onSaveRecord(record);
  };

  return (
    <div id="apft-calc-container" className="bg-[#151b26] border border-[#2b3547] rounded-xl p-6 shadow-xl space-y-6">
      
      {/* Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2b3547] pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-gray-100 flex items-center gap-2">
            <Trophy className="w-5.5 h-5.5 text-yellow-500" />
            ARMY APFT COMMAND TARGET CALC
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Evaluate your physical capability score standards. Min passing mark is <strong className="text-yellow-500">60 in EVERY event</strong>. Max is 300.
          </p>
        </div>

        {/* Toggle brackets */}
        <div className="flex bg-[#1d2736] p-1 rounded-lg border border-[#303f56]">
          <button
            onClick={() => setAgeBracket("27-31")}
            className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
              ageBracket === "27-31" ? "bg-[#3f523c] text-[#a3b18a] font-bold" : "text-gray-400 hover:text-white"
            }`}
          >
            Age 27-31
          </button>
          <button
            onClick={() => setAgeBracket("32-36")}
            className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
              ageBracket === "32-36" ? "bg-[#3f523c] text-[#a3b18a] font-bold" : "text-gray-400 hover:text-white"
            }`}
          >
            Age 32-36
          </button>
        </div>
      </div>

      {/* Main grids: left sliders, right scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders panel */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* PUSH-UPS SLIDER */}
          <div className="bg-[#1b2433] p-4 rounded-lg border border-[#2a374c] space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-gray-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#a3b18a]"></span>
                1. Push-ups <span className="text-[10px] text-gray-500 font-normal">(2 Min Limit)</span>
              </span>
              <span className="text-gray-400">
                Min Pass: <strong className="text-gray-200">{ageBracket === "27-31" ? 39 : 36}</strong> | Max score: <strong className="text-gray-200">{ageBracket === "27-31" ? 77 : 73}</strong>
              </span>
            </div>
            
            <div className="flex items-center gap-4 py-2">
              <input 
                type="range" 
                min="0" 
                max="90" 
                value={pushups}
                onChange={(e) => setPushups(Number(e.target.value))}
                className="grow h-1.5 bg-[#253247] rounded-lg appearance-none cursor-pointer accent-[#a3b18a]"
              />
              <div className="w-16 text-center font-mono text-lg font-bold bg-[#222c3d] text-[#e9c46a] py-1 border border-[#3b4b66] rounded">
                {pushups}
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-gray-400 p-1 bg-[#151b26]/60 rounded">
              <span>Points Earned: <strong className={isPushupPassed ? "text-green-400" : "text-red-400"}>{pushupsScore}/100</strong></span>
              <span className="font-semibold text-gray-300">{isPushupPassed ? "✓ PASS STANDARD" : "⚠️ FAIL (Below 60 pts)"}</span>
            </div>
          </div>

          {/* SIT-UPS SLIDER */}
          <div className="bg-[#1b2433] p-4 rounded-lg border border-[#2a374c] space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-gray-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#a3b18a]"></span>
                2. Sit-ups <span className="text-[10px] text-gray-500 font-normal">(2 Min Limit)</span>
              </span>
              <span className="text-gray-400">
                Min Pass: <strong className="text-gray-200">{ageBracket === "27-31" ? 45 : 40}</strong> | Max score: <strong className="text-gray-200">{ageBracket === "27-31" ? 82 : 76}</strong>
              </span>
            </div>
            
            <div className="flex items-center gap-4 py-2">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={situps}
                onChange={(e) => setSitups(Number(e.target.value))}
                className="grow h-1.5 bg-[#253247] rounded-lg appearance-none cursor-pointer accent-[#a3b18a]"
              />
              <div className="w-16 text-center font-mono text-lg font-bold bg-[#222c3d] text-[#e9c46a] py-1 border border-[#3b4b66] rounded">
                {situps}
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-gray-400 p-1 bg-[#151b26]/60 rounded">
              <span>Points Earned: <strong className={isSitupPassed ? "text-green-400" : "text-red-400"}>{situpsScore}/100</strong></span>
              <span className="font-semibold text-gray-300">{isSitupPassed ? "✓ PASS STANDARD" : "⚠️ FAIL (Below 60 pts)"}</span>
            </div>
          </div>

          {/* TWO-MILE RUN SLIDERS */}
          <div className="bg-[#1b2433] p-4 rounded-lg border border-[#2a374c] space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-gray-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#a3b18a]"></span>
                3. Two-Mile Run
              </span>
              <span className="text-gray-400">
                Min Pass: <strong className="text-gray-200">{ageBracket === "27-31" ? "17:00" : "17:42"}</strong> | Max score: <strong className="text-gray-200">{ageBracket === "27-31" ? "13:18" : "13:48"}</strong>
              </span>
            </div>

            {/* Run time sliders */}
            <div className="grid grid-cols-2 gap-4 pb-1">
              <div>
                <label className="text-[10px] font-mono text-gray-400">Minutes:</label>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="range" 
                    min="11" 
                    max="22" 
                    value={runMinutes}
                    onChange={(e) => setRunMinutes(Number(e.target.value))}
                    className="grow h-1 bg-[#253247] rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-mono font-bold text-gray-200 bg-[#222c3d] px-2.5 py-1 border border-[#3b4b66] rounded">
                    {runMinutes}m
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-gray-400">Seconds:</label>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="range" 
                    min="0" 
                    max="59" 
                    value={runSeconds}
                    onChange={(e) => setRunSeconds(Number(e.target.value))}
                    className="grow h-1 bg-[#253247] rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-mono font-bold text-gray-200 bg-[#222c3d] px-2.5 py-1 border border-[#3b4b66] rounded">
                    {runSeconds}s
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-mono bg-[#1c2e17] py-1 px-3.5 border border-[#35522b]/50 rounded text-gray-300">
              <span>Overall Pace: <strong className="text-yellow-400 font-sans text-sm">{formatRunDuration(totalRunSeconds)}</strong></span>
              <span>Points: <strong className={isRunPassed ? "text-green-400" : "text-red-400"}>{runScore}/100</strong></span>
            </div>
          </div>

        </div>

        {/* Scorecard visualization panel */}
        <div className="lg:col-span-5 bg-[#1b2433] rounded-lg p-5 border border-[#2a374c] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#a3b18a] mb-4 text-center">
              OFFICIAL SCORE RECORD CARD
            </h3>
            
            {/* Huge numeric total */}
            <div className="text-center py-4 bg-[#141b26] rounded-xl border border-[#263347] relative overflow-hidden">
              <span className="text-xs font-mono text-gray-400">COMPOSITE SCORE</span>
              <div className="text-5xl font-mono font-extrabold text-[#f4a261] my-1">
                {totalScore}
              </div>
              <span className="text-[11px] text-gray-500 font-mono block">LIMIT: 300</span>

              {/* Holographic or subtle highlight badge */}
              <div className="absolute top-1 right-2 scale-75">
                {isPassed ? (
                  <span className="bg-[#243e26] text-[#6cb571] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#437547]">
                    PT PASSED
                  </span>
                ) : (
                  <span className="bg-[#411b1b] text-[#ea6767] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#752e2e]">
                    PT FAILED
                  </span>
                )}
              </div>
            </div>

            {/* Individual bar stack */}
            <div className="space-y-3.5 mt-6">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-gray-400">Push-ups Mark:</span>
                  <span className={`font-bold ${isPushupPassed ? "text-[#a3b18a]" : "text-red-400"}`}>
                    {pushupsScore} / 100 {isPushupPassed ? "" : "(Needs 60)"}
                  </span>
                </div>
                <div className="w-full bg-[#151b26] rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${isPushupPassed ? "bg-[#a3b18a]" : "bg-red-400"}`}
                    style={{ width: `${pushupsScore}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-gray-400">Sit-ups Mark:</span>
                  <span className={`font-bold ${isSitupPassed ? "text-[#a3b18a]" : "text-red-400"}`}>
                    {situpsScore} / 100 {isSitupPassed ? "" : "(Needs 60)"}
                  </span>
                </div>
                <div className="w-full bg-[#151b26] rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${isSitupPassed ? "bg-[#a3b18a]" : "bg-red-400"}`}
                    style={{ width: `${situpsScore}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-gray-400">Two-Mile Run Mark:</span>
                  <span className={`font-bold ${isRunPassed ? "text-[#a3b18a]" : "text-red-400"}`}>
                    {runScore} / 100 {isRunPassed ? "" : "(Needs 60)"}
                  </span>
                </div>
                <div className="w-full bg-[#151b26] rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${isRunPassed ? "bg-[#a3b18a]" : "bg-red-400"}`}
                    style={{ width: `${runScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Overall Verdict Descriptor */}
            <div className="mt-5 p-3.5 rounded-lg border text-center text-xs">
              {isPassed ? (
                <div className="text-emerald-400 space-y-1">
                  <div className="font-bold flex items-center justify-center gap-1 text-sm">
                    <Medal className="w-4 h-4 text-yellow-400" />
                    AUTHORIZED TO COMMAND
                  </div>
                  <p className="text-[11px] text-gray-300">
                    {isAced 
                      ? "Flawless work soldier! You achieved a perfect 300 score. Go claim elite officer rank!" 
                      : isGoldLevel 
                        ? `Extremely strong performance! ${totalScore}/300 puts you in elite territory.` 
                        : isSilverLevel 
                          ? "Solid fitness level. Good base, now keep bulking to reach elite 270+." 
                          : "You passed the basic APFT standards. Keep pushing to advance your capacity!"
                    }
                  </p>
                </div>
              ) : (
                <div className="text-red-400 space-y-1">
                  <div className="font-bold uppercase tracking-wider flex items-center justify-center gap-1 text-sm">
                    <ShieldAlert className="w-4 h-4" />
                    Below APFT Requirements
                  </div>
                  <p className="text-[11px] text-gray-300 leading-normal">
                    {!isPushupPassed && "• Push-ups are too low. Practice regular weighted vest drops. "}
                    {!isSitupPassed && "• Sit-ups are below par. Build a rigid isometric hollow-body. "}
                    {!isRunPassed && "• Your 2-mile run time is over the limit. Focus on low aerobic base conditioning. "}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-4 bg-[#3d5a37] hover:bg-[#486b41] text-gray-100 font-mono font-bold py-2.5 px-4 rounded transition-all text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            RECORD THIS LOG ENTRY
          </button>
        </div>

      </div>

      {/* History section / Saved attempts table */}
      {savedRecords.length > 0 && (
        <div className="border-t border-[#2b3547] pt-5 space-y-3">
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400">
            TEST HISTORY LOGS
          </h3>
          
          <div className="overflow-x-auto rounded-lg border border-[#2b3547]">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#1c2433] text-gray-400 font-mono text-[10px] uppercase border-b border-[#2b3547]">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Bracket</th>
                  <th className="px-4 py-2.5 text-center">Pushups Score</th>
                  <th className="px-4 py-2.5 text-center">Situps Score</th>
                  <th className="px-4 py-2.5 text-center">2m Run Time</th>
                  <th className="px-4 py-2.5 text-center font-bold">Total Score</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232d3d] bg-[#121924]/50">
                {savedRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#1a2333]/40 transition-[background]">
                    <td className="px-4 py-2.5 font-mono text-gray-400">{rec.date}</td>
                    <td className="px-4 py-2.5 font-mono">Age {rec.ageBracket}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="font-bold">{rec.pushups}</span> reps ({rec.pushupsScore} pts)
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="font-bold">{rec.situps}</span> reps ({rec.situpsScore} pts)
                    </td>
                    <td className="px-4 py-2.5 text-center font-mono">
                      {formatRunDuration(rec.runTimeSeconds)} ({rec.runScore} pts)
                    </td>
                    <td className="px-4 py-2.5 text-center font-mono font-bold">
                      <span className={rec.passed ? "text-[#a3b18a]" : "text-red-400"}>
                        {rec.totalScore} / 300
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button 
                        onClick={() => onDeleteRecord(rec.id)}
                        className="text-gray-500 hover:text-red-400 p-1 rounded hover:bg-[#253145]/40 transition-colors"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

import { useState } from "react";
import { Dumbbell, Flame, Utensils, Award, CornerRightDown, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function BulkingGuide() {
  const [weightLbs, setWeightLbs] = useState<number>(170);
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [bulkRate, setBulkRate] = useState<number>(350); // surplus calories

  // Calculate customized nutrition metrics
  const bmr = Math.round(10 * (weightLbs / 2.20462) + 6.25 * 180 - 5 * 31 + 5); // Harris-Benedict approximate for 31M at 180cm
  let tdeeMultiplier = 1.375; // light activity
  if (activityLevel === "moderate") tdeeMultiplier = 1.55;
  if (activityLevel === "active") tdeeMultiplier = 1.725;
  const maintenance = Math.round(bmr * tdeeMultiplier);
  const targetCalories = maintenance + bulkRate;
  
  // Bulking Macros: 1g protein per lb, 0.4g healthy fats, rest carbs
  const proteinGrams = Math.round(weightLbs * 1.0);
  const fatGrams = Math.round(weightLbs * 0.4);
  const carbGrams = Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4);

  const overloadTechniques = [
    {
      title: "Mechanical Tension (Tempo Control)",
      desc: "Since you only have 25lb dumbbells, you must create more mechanical tension by moving SLOWER. Use a 4-second eccentric (lowering) phase. This mimics heavier weights and maximizes muscle tears needed for bulking.",
      equipmentUsed: "Dumbbells, Pull-up Bar, Weighted Vest"
    },
    {
      title: "Myo-Rep Match sets",
      desc: "Do a set with your 25lb dumbbells or pull-up bar near failure (e.g., 15 reps). Rest only 10 seconds (3 deep breaths), then perform mini-sets of 3-5 reps with the same weight. This triggers high motor unit recruitment.",
      equipmentUsed: "Dumbbells, Pull-up Bar"
    },
    {
      title: "Vest Layer Progression",
      desc: "Do not start with the full 30lb plate vest immediately. Start with 10lbs or 15lbs to build solid push-ups & pull-ups form, then increase by 5lb increments as your target reps exceed 12.",
      equipmentUsed: "30lb Plate Vest"
    },
    {
      title: "Extended Range Training & Floor Presses",
      desc: "Without a bench, perform Dumbbell Floor Presses focusing on a full 1-second pause at the bottom to eliminate elastic energy, pushing hard to lock out to stress the chest and anterior delts.",
      equipmentUsed: "25lb Dumbbells x2"
    }
  ];

  return (
    <div id="bulking-guide-container" className="bg-[#151b26] border border-[#2b3547] rounded-xl p-6 shadow-xl space-y-8 text-gray-200">
      
      {/* Header section with icon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#2b3547] pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans text-[#a3b18a] tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#e76f51]" />
            LIMITED-EQUIPMENT BULKING PROTOCOL
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            How to trigger maximum hypertrophy using only two 25lb dumbbells, a 30lb plate vest, and a pull-up bar.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-[#212b3d] px-4 py-2 rounded-lg border border-[#3b4961] self-start md:self-auto">
          <Dumbbell className="w-5 h-5 text-[#f4a261]" />
          <span className="font-mono text-xs font-bold text-gray-300">
            LOADOUT: 2x25LB DB | 30LB VEST | CHIN-BAR
          </span>
        </div>
      </div>

      {/* Bulking Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column - Core Principles */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold font-sans text-gray-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Hypertrophy Techniques (Overcoming Fixed Weights)
          </h3>

          <div className="space-y-4">
            {overloadTechniques.map((tech, idx) => (
              <div key={idx} className="bg-[#1b2433] p-4 rounded-lg border border-[#2a374c] hover:border-[#3d4f6b] transition-all">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="font-bold text-sm text-[#f4a261]">{tech.title}</h4>
                  <span className="bg-[#2a374c] text-[10px] text-[#a3b18a] font-mono px-2 py-0.5 rounded uppercase">
                    {tech.equipmentUsed}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mt-1">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#1a1211] border border-red-900/40 p-4 rounded-lg flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-300">Drill Sarge Safety Brief</h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                You only have one spine! When running with a 30lb weighted vest, be cautious of joint wear. Standardize your 2-mile APFT run without the vest first, or wear at most 10-15lbs to safely boost core stabilization. Keep dumbbell work slow, clean, and controlled.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - customized Nutrition Calculator */}
        <div className="bg-[#1b2433] p-6 rounded-xl border border-[#2a374c] space-y-6">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#a3b18a]" />
            <h3 className="text-lg font-bold text-gray-100">Tactical Nutrition & Macro Generator</h3>
          </div>
          
          <p className="text-xs text-gray-400">
            Muscle protein synthesis requires a caloric surplus and positive nitrogen balance. Let's calculate your absolute requirements to gain lean mass.
          </p>

          <div className="space-y-4 pt-2">
            {/* Input weight */}
            <div>
              <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                <label>Your Bodyweight:</label>
                <span className="text-yellow-400 font-bold">{weightLbs} LBS ({Math.round(weightLbs / 2.205)} kg)</span>
              </div>
              <input 
                type="range" 
                min="130" 
                max="260" 
                step="1"
                value={weightLbs}
                onChange={(e) => setWeightLbs(Number(e.target.value))}
                className="w-full h-1.5 bg-[#253247] rounded-lg appearance-none cursor-pointer accent-[#a3b18a]"
              />
            </div>

            {/* Activity level */}
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Daily Training Activity:</label>
              <select 
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full bg-[#253247] border border-[#374b6b] text-gray-200 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#a3b18a] focus:outline-none"
              >
                <option value="light">Light Workouts (2-3 days military prep)</option>
                <option value="moderate">Moderate Workouts (3-5 intense lifting + runs)</option>
                <option value="active">Active Duty Intensity (Daily PT & Bulking splits)</option>
              </select>
            </div>

            {/* Bulking Aggressiveness */}
            <div>
              <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                <label>Bulking Surplus Target:</label>
                <span className="text-orange-400 font-bold">+{bulkRate} Kcal / Day</span>
              </div>
              <input 
                type="range" 
                min="200" 
                max="600" 
                step="50"
                value={bulkRate}
                onChange={(e) => setBulkRate(Number(e.target.value))}
                className="w-full h-1.5 bg-[#253247] rounded-lg appearance-none cursor-pointer accent-orange-400"
              />
            </div>
          </div>

          <div className="border-t border-[#2e3e57] pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Your Action Diet Targets:</h4>
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#242f44] p-2.5 rounded border border-[#31425e]">
                <div className="text-[10px] text-gray-400 uppercase">Daily Calorie Target</div>
                <div className="text-xl font-bold font-mono text-[#a3b18a]">{targetCalories}</div>
                <div className="text-[9px] text-gray-500 font-mono">BMR maintenance: {maintenance}</div>
              </div>
              
              <div className="bg-[#242f44] p-2.5 rounded border border-[#31425e]">
                <div className="text-[10px] text-[#e76f51] uppercase font-bold">Daily Protein Goal</div>
                <div className="text-xl font-bold font-mono text-[#e76f51]">{proteinGrams}G</div>
                <div className="text-[9px] text-gray-500 font-mono">1.0g per lb of bodyweight</div>
              </div>
            </div>

            {/* Carbs and Fats breakdown */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#1f283a] p-2 rounded border border-[#2b3a52]">
                <span className="text-[10px] text-gray-400">CARBOHYDRATES</span>
                <div className="text-sm font-bold text-gray-300 font-mono">{carbGrams}G</div>
              </div>
              <div className="bg-[#1f283a] p-2 rounded border border-[#2b3a52]">
                <span className="text-[10px] text-gray-400">HEALTHY FATS</span>
                <div className="text-sm font-bold text-gray-300 font-mono">{fatGrams}G</div>
              </div>
            </div>

            <div className="bg-[#253247]/50 rounded-lg p-3 text-xs border border-[#354664]">
              <div className="font-bold text-[#f4a261] mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                DUMBBELL & CHIN MASS RECIPE:
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                Eat 4 whole meals a day. Prioritize 40-50g of protein within 2 hours after your Weighted Vest chin-ups and floor presses. Since training volume is high to compensate for fixed weights, recovery (8+ hrs sleep) is your primary vector for adding thickness.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

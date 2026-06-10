import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK to prevent startup crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;
function getAi() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please add it to Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API: Custom Motivation Speech (Sergeant Speech)
app.post("/api/gemini/motivation", async (req, res) => {
  try {
    const { persona, currentFeelings } = req.body;
    
    const prompt = `You are an elite military fitness coach. Your client is a 31-year-old male who has zero motivation to work out but wants to bulk up, gain lean muscle mass, and ace the army physical fitness test (APFT).
He owns:
- Two 25lb dumbbells
- A 30lb weighted plate vest
- A pull-up bar

Specific mental blocks reported today: "${currentFeelings || "Feeling extremely lazy, dragging feet, zero drive"}".
Coach Persona: "${persona || "Hardcore Drill Sergeant"}". (Make sure you fully assume this role!).

Provide a powerful, highly engaging, personalized motivational message to kickstart his workout. Speak directly, call him out on excuses if appropriate, and remind him that steel is built under pressure.
Structure your response as a JSON object with these exact keys:
- "headline": A catchy, high-impact tactical heading (e.g., "MISSION DIRECTIVE: REFRAIN FROM WEAKNESS").
- "speech": A highly motivating paragraph or two in the requested persona voice.
- "tip": One tactical bulking or training tip specifically about how to utilize his exact equipment (25lb dumbbells, 30lb vest, or pull-up bar) to trigger hypertrophy.
- "action": A direct high-impact single-sentence instruction to do RIGHT NOW (e.g. "Drop and give me 10 pushups right now to prime your central nervous system!").`;

    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            speech: { type: Type.STRING },
            tip: { type: Type.STRING },
            action: { type: Type.STRING }
          },
          required: ["headline", "speech", "tip", "action"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/motivation:", error);
    res.status(500).json({ error: error.message || "Failed to generate motivation" });
  }
});

// 2. API: Generate Workout Mission
app.post("/api/gemini/workout", async (req, res) => {
  try {
    const { focusType, intensity } = req.body;
    
    const prompt = `Generate a customized, highly structured 31M tactical workout session.
User details:
- Age/Gender: 31M (Healthy but needs bulking & APFT/ACFT scoring prep)
- Equipment available: 2x 25lb dumbbells, 30lb weighted plate vest, pull-up bar, and bodyweight.
- Today's Training Focus: "${focusType || "Full-Body Tactical Strength"}" (Options could be "APFT Mastery", "Upper Body Mass", "Weighted Power", "Tactical Core & Run-Prep Cardio").
- Intensity Level: "${intensity || "Standard Command"}".

Return a rigorous workout in JSON format. Keep in mind that for bulking with limited load (2x25lb dumbbells & 30lb vest), hypertrophy is triggered by slower tempos, high volume to close proximity to failure (RPE 8-10), and progressive overload via vest layers or high density. For APFT (Pushups, Situps, 2m Run), focus on muscle endurance and pacing.
Format your output as a JSON object matching this schema exactly:
{
  "title": "Title of the Workout",
  "focus": "The specific athletic focus",
  "estimatedTimeMinutes": 35,
  "difficulty": "Medium",
  "tacticalCoachBrief": "A short, sharp tactical briefing on how to execute this session with maximum intensity.",
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 4,
      "reps": "12-15 reps",
      "targetMuscle": "e.g. Chest & Triceps",
      "equipment": "e.g. Pull-up Bar & Weighted Vest",
      "tempo": "e.g. 3-0-1-0 (3s lowering)",
      "techniqueTip": "Brief crucial cues on how to execute properly."
    }
  ],
  "motivationalCallout": "One final punchy phrase to remember when the burn sets in."
}`;

    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            focus: { type: Type.STRING },
            estimatedTimeMinutes: { type: Type.INTEGER },
            difficulty: { type: Type.STRING },
            tacticalCoachBrief: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.INTEGER },
                  reps: { type: Type.STRING },
                  targetMuscle: { type: Type.STRING },
                  equipment: { type: Type.STRING },
                  tempo: { type: Type.STRING },
                  techniqueTip: { type: Type.STRING }
                },
                required: ["name", "sets", "reps", "targetMuscle", "equipment", "tempo", "techniqueTip"]
              }
            },
            motivationalCallout: { type: Type.STRING }
          },
          required: ["title", "focus", "estimatedTimeMinutes", "difficulty", "tacticalCoachBrief", "exercises", "motivationalCallout"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/workout:", error);
    res.status(500).json({ error: error.message || "Failed to generate workout mission" });
  }
});

// Configure Vite middleware in development or express static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on http://localhost:${PORT}`);
  });
}

startServer();

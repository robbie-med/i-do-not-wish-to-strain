export interface Exercises {
  name: string;
  sets: number;
  reps: string;
  targetMuscle: string;
  equipment: string;
  tempo: string;
  techniqueTip: string;
}

export interface WorkoutPlan {
  title: string;
  focus: string;
  estimatedTimeMinutes: number;
  difficulty: string;
  tacticalCoachBrief: string;
  exercises: Exercises[];
  motivationalCallout: string;
}

export interface APFTRecord {
  id: string;
  date: string;
  ageBracket: "27-31" | "32-36";
  pushups: number;
  pushupsScore: number;
  situps: number;
  situpsScore: number;
  runTimeSeconds: number; // e.g. 900 for 15:00
  runScore: number;
  totalScore: number;
  passed: boolean;
}

export interface LoggedWorkout {
  id: string;
  date: string;
  title: string;
  focus: string;
  durationMinutes: number;
  exercisesCompletedCount: number;
  coachPersonaAtTime: string;
  feedbackNotes: string;
  weightGainedProgress?: number; // optionally logged bodyweight
}

export interface ClientMotivation {
  headline: string;
  speech: string;
  tip: string;
  action: string;
}

export type CoachPersonaId = "drill_sergeant" | "tactical_operator" | "no_excuse_mentor" | "bro_science_chief";

export interface CoachPersona {
  id: CoachPersonaId;
  name: string;
  role: string;
  avatarEmoji: string;
  voiceDescription: string;
  bgGrad: string;
  textAccent: string;
}

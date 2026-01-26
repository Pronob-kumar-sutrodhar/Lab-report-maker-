export interface Problem {
  id: string;
  title: string; // e.g., "Problem 1" or "Matrix Multiplication"
  description: string;
  code: string;
}

export interface LabData {
  labNumber: string;
  labTitle: string; // The "Workout" title
  codeforcesLink: string;
  problems: Problem[];
}

export interface GenerationState {
  status: 'idle' | 'generating' | 'success' | 'error';
  result: string | null;
  error: string | null;
}
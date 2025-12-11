export enum Screen {
  HOME = 'HOME',
  LESSON_SYLLABLES = 'LESSON_SYLLABLES',
  GAME_SYLLABLES = 'GAME_SYLLABLES',
  LESSON_STRESS = 'LESSON_STRESS',
  GAME_STRESS = 'GAME_STRESS',
  LESSON_RULES = 'LESSON_RULES',
  GAME_MASTER = 'GAME_MASTER'
}

export interface WordChallenge {
  word: string;
  syllables: string[];
  stressIndex: number; // 0-based index of the stressed syllable
  translation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'aguda' | 'grave' | 'esdrujula';
  emoji?: string; // Added for visual decoration
}

export interface GameState {
  score: number;
  streak: number;
  level: number;
}
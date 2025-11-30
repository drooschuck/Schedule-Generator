
export enum SubSubject {
  Physics = 'Physics',
  Chemistry = 'Chemistry',
  Biology = 'Biology'
}

export interface Subject {
  name: string;
  subSubjects?: SubSubject[];
}

export type SelectedSubjects = {
  [key: string]: boolean | { [key in SubSubject]?: boolean }
};

export enum BreakPreference {
  Pomodoro = 'Pomodoro (25 min study, 5 min break)',
  LongerSessions = 'Longer study sessions (50 min study, 10 min break)',
  Flexible = 'Flexible (varied session lengths)'
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
}

export enum SessionType {
    Study = 'study',
    Break = 'break',
    Other = 'other',
    PastPaper = 'past_paper',
    Revision = 'revision'
}

export interface Session {
  id: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  activity: string;
  subject?: string;
  type: SessionType;
  completed: boolean;
}

export type Schedule = Session[];

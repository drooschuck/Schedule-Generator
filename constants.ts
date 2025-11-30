import { Subject, BreakPreference } from './types';
import { SubSubject } from './types';

export const SUBJECTS: Subject[] = [
  { name: 'Maths' },
  { name: 'English' },
  { 
    name: 'Science',
    subSubjects: [SubSubject.Physics, SubSubject.Chemistry, SubSubject.Biology]
  },
  { name: 'History' },
  { name: 'Geography' },
  { name: 'French' },
  { name: 'Spanish' },
  { name: 'Computing' },
  { name: 'Art' },
  { name: 'Music' },
  { name: 'Religious Education (RE)' }
];

export const BREAK_PREFERENCES: BreakPreference[] = [
  BreakPreference.Pomodoro,
  BreakPreference.LongerSessions,
  BreakPreference.Flexible
];
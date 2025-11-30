
import React, { useState, useCallback } from 'react';
import { Schedule, Session, SelectedSubjects, BreakPreference, Exam } from './types';
import { generateSchedule } from './services/geminiService';
import ScheduleForm from './components/ScheduleForm';
import ScheduleView from './components/ScheduleView';
import useLocalStorage from './hooks/useLocalStorage';
import { SUBJECTS } from './constants';

const initialSubjects: SelectedSubjects = SUBJECTS.reduce((acc, subject) => {
  if (subject.subSubjects) {
    acc[subject.name] = subject.subSubjects.reduce((subAcc, sub) => {
        subAcc[sub] = false;
        return subAcc;
    }, {} as {[key in typeof subject.subSubjects[number]]: boolean});
  } else {
    acc[subject.name] = false;
  }
  return acc;
}, {} as SelectedSubjects);

function App() {
  const [schedule, setSchedule] = useLocalStorage<Schedule | null>('currentSchedule', null);
  const [savedSchedules, setSavedSchedules] = useLocalStorage<Schedule[]>('savedSchedules', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exams, setExams] = useLocalStorage<Exam[]>('exams', []);

  const handleGenerateSchedule = useCallback(async (
    wakeUpTime: string,
    studyHours: number,
    selectedSubjects: SelectedSubjects,
    breakPreference: BreakPreference
  ) => {
    setIsLoading(true);
    setError(null);
    setSchedule(null);

    const anySubjectSelected = Object.values(selectedSubjects).some(val => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'object') return Object.values(val).some(subVal => subVal);
        return false;
    });

    if (!anySubjectSelected) {
        setError("Please select at least one subject.");
        setIsLoading(false);
        return;
    }

    try {
      const newSchedule = await generateSchedule(wakeUpTime, studyHours, selectedSubjects, breakPreference, exams);
      setSchedule(newSchedule);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [exams, setSchedule]);

  const handleUpdateSession = (updatedSession: Session) => {
    if (!schedule) return;
    const newSchedule = schedule.map(session =>
      session.id === updatedSession.id ? updatedSession : session
    );
    setSchedule(newSchedule);
  };
  
  const handleToggleComplete = (sessionId: string) => {
    if (!schedule) return;
    const newSchedule = schedule.map(session =>
      session.id === sessionId ? { ...session, completed: !session.completed } : session
    );
    setSchedule(newSchedule);
  };

  const addExam = (exam: Omit<Exam, 'id'>) => {
    setExams(prev => [...prev, { ...exam, id: Date.now().toString() }]);
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(exam => exam.id !== id));
  };
  
  const handleSaveSchedule = () => {
    if (schedule) {
      setSavedSchedules(prev => [...prev, schedule]);
      alert('Schedule saved successfully!');
    }
  };

  const progress = schedule ? (schedule.filter(s => s.completed).length / schedule.filter(s => s.type !== 'break' && s.type !== 'other').length) * 100 : 0;

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-lg print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">GCSE Revision Schedule Generator</h1>
          <p className="mt-2 text-indigo-200">Create your perfect daily revision plan based on proven study techniques</p>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 print:hidden">
            <ScheduleForm
              onGenerate={handleGenerateSchedule}
              isLoading={isLoading}
              initialSubjects={initialSubjects}
              exams={exams}
              addExam={addExam}
              deleteExam={deleteExam}
            />
          </div>
          <div className="lg:col-span-2">
            <ScheduleView
              schedule={schedule}
              isLoading={isLoading}
              error={error}
              onUpdateSession={handleUpdateSession}
              onToggleComplete={handleToggleComplete}
              progress={progress}
              onSaveSchedule={handleSaveSchedule}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

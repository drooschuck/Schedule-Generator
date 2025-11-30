
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
  
  const handleDownloadSchedule = () => {
    if (schedule) {
      const date = new Date().toLocaleDateString();
      const dateForFilename = new Date().toISOString().split('T')[0];
      let content = `GCSE Revision Schedule - ${date}\n\n`;
      content += `Progress: ${Math.round(progress)}%\n\n`;
      
      schedule.forEach(session => {
        const time = `${session.startTime} - ${session.endTime}`;
        const subject = session.subject ? `[${session.subject}] ` : '';
        const status = session.completed ? '(Completed)' : '(Pending)';
        content += `${time}: ${subject}${session.activity} ${status}\n`;
      });

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revision-schedule-${dateForFilename}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const progress = schedule ? (schedule.filter(s => s.completed).length / schedule.filter(s => s.type !== 'break' && s.type !== 'other').length) * 100 : 0;

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <style>{`
        @media screen {
            .print-only { display: none !important; }
        }
        @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            
            /* Reset all layout constraints for print to ensure the table takes full width */
            body, main, .container, .grid, .lg\\:col-span-2 { 
                display: block !important; 
                width: 100% !important; 
                max-width: none !important; 
                padding: 0 !important;
                margin: 0 !important;
                overflow: visible !important;
            }
            
            /* Hide the form specifically if it isn't covered by no-print */
            .lg\\:col-span-1 {
                display: none !important;
            }

            * { color: black !important; }
            @page { margin: 1.5cm; size: auto; }
        }
      `}</style>
      <header className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-lg no-print">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">GCSE Revision Schedule Generator</h1>
          <p className="mt-2 text-indigo-200">Create your perfect daily revision plan based on proven study techniques</p>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 no-print">
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
              onSaveSchedule={handleDownloadSchedule}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

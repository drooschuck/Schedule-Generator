import React, { useState, FormEvent } from 'react';
import { SelectedSubjects, BreakPreference, Exam } from '../types';
import { SUBJECTS, BREAK_PREFERENCES } from '../constants';
import { ClockIcon, PlusIcon, TrashIcon } from './icons';
import Modal from './Modal';

interface ScheduleFormProps {
  onGenerate: (
    wakeUpTime: string,
    studyHours: number,
    selectedSubjects: SelectedSubjects,
    breakPreference: BreakPreference
  ) => void;
  isLoading: boolean;
  initialSubjects: SelectedSubjects;
  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  deleteExam: (id: string) => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onGenerate, isLoading, initialSubjects, exams, addExam, deleteExam }) => {
  const [wakeUpTime, setWakeUpTime] = useState('07:00');
  const [studyHours, setStudyHours] = useState(5);
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubjects>(initialSubjects);
  const [breakPreference, setBreakPreference] = useState<BreakPreference>(BreakPreference.Pomodoro);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const [newExamSubject, setNewExamSubject] = useState(SUBJECTS[0].name);
  const [newExamDate, setNewExamDate] = useState('');
  const [newExamTime, setNewExamTime] = useState('');

  const handleSubjectChange = (subjectName: string, subSubjectName?: string) => {
    setSelectedSubjects(prev => {
      const newSubjects = { ...prev };
      const subject = newSubjects[subjectName];
      if (typeof subject === 'object' && subSubjectName) {
        subject[subSubjectName as keyof typeof subject] = !subject[subSubjectName as keyof typeof subject];
      } else {
        newSubjects[subjectName] = !subject;
      }
      return newSubjects;
    });
  };

  const handleAddExam = (e: FormEvent) => {
    e.preventDefault();
    if(newExamSubject && newExamDate) {
        addExam({ subject: newExamSubject, date: newExamDate, time: newExamTime });
        setNewExamSubject(SUBJECTS[0].name);
        setNewExamDate('');
        setNewExamTime('');
        setIsExamModalOpen(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onGenerate(wakeUpTime, studyHours, selectedSubjects, breakPreference);
  };
  
  const allSubjects = SUBJECTS.flatMap(s => s.subSubjects ? s.subSubjects.map(sub => `${s.name} - ${sub}`) : s.name);

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Create Your Schedule</h2>

        <div>
          <label htmlFor="wake-up-time" className="block text-sm font-medium text-gray-700 mb-1">Wake Up Time</label>
          <div className="relative">
            <input
              type="time"
              id="wake-up-time"
              value={wakeUpTime}
              onChange={(e) => setWakeUpTime(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ClockIcon />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="study-hours" className="block text-sm font-medium text-gray-700 mb-1">Available Study Hours</label>
          <div className="relative">
            <select
              id="study-hours"
              value={studyHours}
              onChange={(e) => setStudyHours(Number(e.target.value))}
              className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 px-3 pr-8 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} hour{i > 0 ? 's' : ''}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Select Your Subjects</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {SUBJECTS.map(subject => (
              <div key={subject.name}>
                <div className="flex items-center">
                  <input
                    id={subject.name}
                    type="checkbox"
                    checked={typeof selectedSubjects[subject.name] === 'boolean' ? !!selectedSubjects[subject.name] : false}
                    onChange={() => handleSubjectChange(subject.name)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={subject.name} className="ml-2 block text-sm text-gray-900">{subject.name}</label>
                </div>
                {subject.subSubjects && (selectedSubjects[subject.name] || typeof selectedSubjects[subject.name] === 'object') && (
                  <div className="ml-6 mt-1 space-y-1">
                    {subject.subSubjects.map(sub => (
                       <div key={sub} className="flex items-center">
                         <input
                           id={`${subject.name}-${sub}`}
                           type="checkbox"
                           checked={!!(selectedSubjects[subject.name] as any)[sub]}
                           onChange={() => handleSubjectChange(subject.name, sub)}
                           className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                         />
                         <label htmlFor={`${subject.name}-${sub}`} className="ml-2 block text-sm text-gray-900">{sub}</label>
                       </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Upcoming Exams</h3>
          <div className="space-y-2">
            {exams.length > 0 ? (
                exams.map(exam => (
                    <div key={exam.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md text-sm">
                        <span><strong>{exam.subject}</strong> on {exam.date}</span>
                        <button type="button" onClick={() => deleteExam(exam.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-500">No exams scheduled.</p>
            )}
            <button type="button" onClick={() => setIsExamModalOpen(true)} className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 border border-dashed border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <PlusIcon /> Add Exam
            </button>
        </div>
        </div>

        <div>
          <label htmlFor="break-preference" className="block text-sm font-medium text-gray-700 mb-1">Break Preference</label>
          <div className="relative">
            <select
              id="break-preference"
              value={breakPreference}
              onChange={(e) => setBreakPreference(e.target.value as BreakPreference)}
              className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 px-3 pr-8 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {BREAK_PREFERENCES.map(pref => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : 'Generate Schedule'}
        </button>
      </form>
      <Modal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} title="Add New Exam">
        <form onSubmit={handleAddExam} className="space-y-4">
            <div>
                <label htmlFor="exam-subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <select id="exam-subject" value={newExamSubject} onChange={e => setNewExamSubject(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="exam-date" className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" id="exam-date" value={newExamDate} onChange={e => setNewExamDate(e.target.value)} required className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
            </div>
             <div>
                <label htmlFor="exam-time" className="block text-sm font-medium text-gray-700">Time (Optional)</label>
                <input type="time" id="exam-time" value={newExamTime} onChange={e => setNewExamTime(e.target.value)} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
            </div>
            <div className="flex justify-end pt-2">
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add Exam
                </button>
            </div>
        </form>
      </Modal>
    </>
  );
};

export default ScheduleForm;
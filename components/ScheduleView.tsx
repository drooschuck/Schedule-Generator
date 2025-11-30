
import React, { useState } from 'react';
import { Schedule, Session, SessionType } from '../types';
import { EditIcon } from './icons';
import Modal from './Modal';

interface ScheduleViewProps {
  schedule: Schedule | null;
  isLoading: boolean;
  error: string | null;
  onUpdateSession: (session: Session) => void;
  onToggleComplete: (sessionId: string) => void;
  progress: number;
  onSaveSchedule: () => void;
}

const SessionItem: React.FC<{ session: Session; onUpdateSession: (session: Session) => void; onToggleComplete: (sessionId: string) => void }> = ({ session, onUpdateSession, onToggleComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState(session.activity);

  const handleSave = () => {
    onUpdateSession({ ...session, activity: editedActivity });
    setIsEditing(false);
  };
  
  const getBorderColor = (type: SessionType) => {
    switch (type) {
      case SessionType.Study:
      case SessionType.PastPaper:
      case SessionType.Revision:
        return 'border-indigo-500';
      case SessionType.Break:
        return 'border-pink-500';
      default:
        return 'border-blue-500';
    }
  };

  const getSubjectColor = (subject?: string) => {
    if (!subject) return 'bg-gray-400 text-white';
    const hash = subject.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const colors = [
      'bg-purple-600 text-white', 'bg-blue-600 text-white', 'bg-green-600 text-white',
      'bg-yellow-500 text-black', 'bg-red-600 text-white', 'bg-teal-500 text-white'
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hours = parseInt(h, 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours}:${m} ${period}`;
  };

  return (
    <>
      <div className={`flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border-l-4 ${getBorderColor(session.type)} ${session.completed ? 'opacity-60' : ''}`}>
        <div className="flex-shrink-0 w-24 text-right">
          <p className="font-semibold text-gray-800">{formatTime(session.startTime)}</p>
          <p className="text-sm text-gray-500">to {formatTime(session.endTime)}</p>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={session.completed} onChange={() => onToggleComplete(session.id)} className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <p className={`font-medium text-gray-900 ${session.completed ? 'line-through' : ''}`}>{session.activity}</p>
            </div>
            <div className="flex items-center gap-2">
              {session.subject && (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSubjectColor(session.subject)}`}>
                  {session.subject}
                </span>
              )}
              <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-indigo-600">
                <EditIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Session">
        <div className="space-y-4">
          <div>
            <label htmlFor="activity-edit" className="block text-sm font-medium text-gray-700">Activity</label>
            <input 
              type="text" 
              id="activity-edit" 
              value={editedActivity}
              onChange={(e) => setEditedActivity(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, isLoading, error, onUpdateSession, onToggleComplete, progress, onSaveSchedule }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md printable-area">
        <div className="flex justify-between items-center mb-6 print:hidden">
            <h2 className="text-xl font-bold text-gray-800">Your Revision Schedule</h2>
            {schedule && schedule.length > 0 && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={onSaveSchedule}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save Schedule
                    </button>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Print Schedule
                    </button>
                </div>
            )}
        </div>
        
        {schedule && schedule.length > 0 && (
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700">Daily Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">{Math.round(progress)}% complete</p>
            </div>
        )}

        <div className="space-y-4">
            {isLoading && (
                <div className="flex flex-col items-center justify-center text-center p-8">
                <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600 font-medium">Generating your personalized schedule...</p>
                <p className="text-sm text-gray-500 mt-1">This might take a moment.</p>
                </div>
            )}
            {error && <div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div>}
            {!isLoading && !error && !schedule && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No schedule generated</h3>
                    <p className="mt-1 text-sm text-gray-500">Fill out the form to create your revision plan.</p>
                </div>
            )}
            {schedule && schedule.map(session => (
                <SessionItem key={session.id} session={session} onUpdateSession={onUpdateSession} onToggleComplete={onToggleComplete} />
            ))}
        </div>
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              .printable-area, .printable-area * {
                visibility: visible;
              }
              .printable-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
            }
          `}
        </style>
    </div>
  );
};

export default ScheduleView;

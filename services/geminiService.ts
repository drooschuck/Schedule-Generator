
import { GoogleGenAI, Type } from "@google/genai";
import { Schedule, SelectedSubjects, BreakPreference, Exam } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. Please provide a valid API key for the app to function.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_HERE" });

const getSelectedSubjectsList = (selectedSubjects: SelectedSubjects): string[] => {
  const subjects: string[] = [];
  for (const subject in selectedSubjects) {
    const value = selectedSubjects[subject];
    if (typeof value === 'boolean' && value) {
      subjects.push(subject);
    } else if (typeof value === 'object') {
      const subSubjects = Object.keys(value).filter(sub => value[sub as keyof typeof value]);
      if (subSubjects.length > 0) {
        subjects.push(`${subject} (${subSubjects.join(', ')})`);
      }
    }
  }
  return subjects;
}

export const generateSchedule = async (
  wakeUpTime: string,
  studyHours: number,
  selectedSubjects: SelectedSubjects,
  breakPreference: BreakPreference,
  exams: Exam[]
): Promise<Schedule> => {
  const subjectsList = getSelectedSubjectsList(selectedSubjects);

  const prompt = `
    You are an expert academic coach creating a daily GCSE revision schedule.
    Your task is to generate a schedule in JSON format based on these parameters:
    - Wake Up Time: ${wakeUpTime}
    - Total Available Study Hours: ${studyHours}
    - Subjects to Revise: ${subjectsList.join(', ')}
    - Break Preference: "${breakPreference}". This should guide the length of study sessions and breaks. 
      - Pomodoro: 25-minute study sessions, 5-minute breaks.
      - Longer Sessions: 50-minute study sessions, 10-minute breaks.
      - Flexible: Mix of session lengths, but generally between 20-60 minutes.
    - Upcoming Exams: ${exams.length > 0 ? exams.map(e => `${e.subject} on ${e.date}`).join(', ') : 'None specified.'}

    Instructions:
    1.  The schedule must start with a "Wake up & morning routine" activity for the first 30-60 minutes from the wake up time.
    2.  Prioritize subjects with the closest upcoming exams.
    3.  Incorporate proven study techniques:
        -   **Subject Variety:** Alternate between different subjects to keep the mind engaged. Don't schedule the same subject for more than two consecutive study blocks.
        -   **Active Recall:** Include specific activities like "Past paper practice", "Create flashcards", "Mind map for [Topic]", "Teach the topic to an imaginary person". Be creative.
        -   **Tackle Hardest First:** Schedule a session for what is perceived as the hardest subject (e.g. Maths, Science) early in the study period.
    4.  The total time for all 'study', 'past_paper', and 'revision' sessions should approximate the 'Total Available Study Hours'. Breaks do not count towards this total.
    5.  All times must be in "HH:MM" 24-hour format.
    6.  The 'id' for each session must be a unique string.
    7.  The 'subject' field should only be present for study-related sessions.
    8.  The 'completed' field must be 'false'.
    9.  Do not include any explanations, just the raw JSON output.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              startTime: { type: Type.STRING },
              endTime: { type: Type.STRING },
              activity: { type: Type.STRING },
              subject: { type: Type.STRING },
              type: { 
                type: Type.STRING,
                enum: ['study', 'break', 'other', 'past_paper', 'revision']
              },
              completed: { type: Type.BOOLEAN },
            },
            required: ['id', 'startTime', 'endTime', 'activity', 'type', 'completed']
          }
        },
      },
    });

    const jsonText = response.text;
    const scheduleData = JSON.parse(jsonText) as Schedule;
    return scheduleData;

  } catch (error) {
    console.error("Error generating schedule:", error);
    throw new Error("Failed to generate schedule from AI. Please check your API key and try again.");
  }
};

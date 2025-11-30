
# Product Requirements Document: GCSE Revision Schedule Generator

## 1. Overview

**Product Name**: GCSE Revision Schedule Generator
**Target Audience**: GCSE students in the UK.
**Product Goal**: To provide students with a powerful, easy-to-use tool that generates personalized and effective daily revision schedules, helping to reduce stress, improve study habits, and increase exam performance.

## 2. Background and Problem Statement

GCSE revision is a stressful period for students. Many struggle with organizing their time effectively, knowing what to study, and how to balance different subjects. Standard, one-size-fits-all revision timetables often fail because they don't account for individual needs, available time, or proven study methodologies. This leads to procrastination, burnout, and inefficient learning.

This product aims to solve this by using AI to create a truly personalized schedule that incorporates established learning techniques, making revision more structured, manageable, and effective.

## 3. Features and Functional Requirements

### 3.1. Core Feature: AI-Powered Schedule Generation
-   **FR-1.1**: The user must be able to input their desired wake-up time.
-   **FR-1.2**: The user must be able to select their total available study hours for the day (e.g., 1-10 hours).
-   **FR-1.3**: The user must be able to select the subjects they wish to revise from a predefined list of common GCSE subjects.
-   **FR-1.4**: For subjects like Science, the user must be able to select specific sub-subjects (Physics, Chemistry, Biology).
-   **FR-1.5**: The user must be able to select a break preference (e.g., Pomodoro, Longer Sessions) to dictate the rhythm of study and break periods.
-   **FR-1.6**: The system shall use the Gemini API to generate a schedule based on these inputs. The generation logic must be instructed to:
    -   Incorporate subject variety to avoid monotony.
    -   Suggest active recall techniques (e.g., "Past Paper Practice").
    -   Prioritize subjects with upcoming exams.
    -   Begin the day with a "morning routine" and allocate breaks appropriately.
-   **FR-1.7**: The application must display a loading state while the schedule is being generated.
-   **FR-1.8**: The application must display a clear error message if the schedule generation fails.

### 3.2. Feature: Schedule Display and Interaction
-   **FR-2.1**: The generated schedule must be displayed in a clear, chronological timeline format.
-   **FR-2.2**: Each session in the schedule must show a start time, end time, and activity description.
-   **FR-2.3**: Study sessions must be clearly distinguished from break sessions using color-coding or visual indicators.
-   **FR-2.4**: The user must be able to edit the activity description of any session in the schedule.
-   **FR-2.5**: The user must be able to print a clean, print-friendly version of the schedule.

### 3.3. Feature: Exam Prioritization
-   **FR-3.1**: The user must be able to add upcoming exams, specifying the subject and date.
-   **FR-3.2**: The user must be able to view and delete scheduled exams.
-   **FR-3.3**: The schedule generation logic must use the list of exams to prioritize revision for subjects with imminent deadlines.

### 3.4. Feature: Progress Tracking
-   **FR-4.1**: The user must be able to mark individual revision sessions as "complete".
-   **FR-4.2**: The application must display a progress bar or percentage indicating the proportion of completed tasks for the day.
-   **FR-4.3**: Completed tasks should be visually distinct (e.g., faded out, struck through).

### 3.5. Non-Functional Requirements
-   **NFR-1 (Usability)**: The interface must be intuitive, clean, and easy to navigate for a non-technical user.
-   **NFR-2 (Responsiveness)**: The application must be fully functional and aesthetically pleasing on desktop, tablet, and mobile devices.
-   **NFR-3 (Persistence)**: The user's current schedule and list of exams should be saved in the browser so that the data persists between sessions.
-   **NFR-4 (Offline Capability)**: The application should be a Progressive Web App (PWA), allowing it to be installed on a user's device and function without an internet connection (schedule generation requires a connection).

## 4. Design and UX

-   The design should be modern, clean, and encouraging.
-   The primary color scheme will be based on purples and indigos, as seen in the inspiration image.
-   The layout will be a two-column design on desktop (form on the left, schedule on the right), collapsing to a single column on mobile.
-   Loading indicators and feedback messages should be used to create a smooth user experience.

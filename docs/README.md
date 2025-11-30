
# GCSE Revision Schedule Generator

An intelligent revision schedule generator that creates personalized study plans for GCSE students using AI. This application leverages proven study techniques like the Pomodoro method, active recall, and spaced repetition to build effective and manageable daily schedules.

## Features

- **AI-Powered Schedule Generation**: Utilizes the Google Gemini API to create dynamic and intelligent revision plans based on user inputs.
- **Personalized Inputs**: Users can specify their wake-up time, available study hours, subjects (including sub-subjects for Science), and preferred break styles.
- **Proven Study Techniques**: The generated schedule incorporates:
  - **Pomodoro Technique**: Or other break preferences for optimal focus.
  - **Active Recall**: Suggests activities like "past paper practice" and "create mind maps".
  - **Spaced Repetition & Subject Variety**: Intelligently alternates subjects to improve retention and maintain engagement.
- **Exam Prioritization**: Schedules revision focus based on upcoming exam dates.
- **Interactive & Editable Schedule**: View the generated schedule in a clean timeline format. Any session's activity can be edited on the fly.
- **Progress Tracking**: Mark sessions as complete and visually track your daily progress with a progress bar.
- **Print Functionality**: Easily print a clean, formatted version of your schedule for offline use.
- **Persistent State**: Your current schedule and list of exams are saved in your browser, so you can come back anytime.
- **Fully Responsive**: A clean and modern UI that works seamlessly on both desktop and mobile devices.
- **Progressive Web App (PWA)**: Installable on your device and works offline, thanks to a service worker that caches application assets.

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (`@google/genai`)
- **State Management**: React Hooks (`useState`, `useCallback`)
- **Offline Storage**: `localStorage` and Service Worker Caching

## Getting Started

### Prerequisites

- A modern web browser.
- A Google Gemini API Key.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd gcse-revision-schedule-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Gemini API key:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## How It Works

The user fills out a simple form with their revision preferences. This data is sent to a service that constructs a detailed prompt for the Gemini API. The prompt instructs the AI to act as an academic coach and generate a JSON object representing the schedule, following all the specified rules and study techniques. The application then parses this JSON and displays it to the user in an interactive format.

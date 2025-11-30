
# Application Architecture

This document outlines the architecture of the GCSE Revision Schedule Generator, a client-side single-page application (SPA) built with React.

## Overview

The application is designed with a clear separation of concerns, organized into components, services, hooks, and type definitions. It is a pure frontend application that relies on the user's browser for all its functionality, including state storage and API communication.

## Core Components

The architecture is primarily component-based, following standard React practices.

1.  **`App.tsx` (Main Component)**
    -   Serves as the root of the component tree.
    -   Manages the primary application state, such as the current `schedule`, `exams` list, `isLoading` status, and `error` messages.
    -   Orchestrates data flow between the `ScheduleForm` and `ScheduleView` components.
    -   Handles the main logic for fetching the schedule from the Gemini service and updating the state accordingly.

2.  **`components/` Directory**
    -   **`ScheduleForm.tsx`**: A controlled component responsible for gathering all user inputs. It manages its own form state and communicates with the `App` component via a callback (`onGenerate`) when the form is submitted.
    -   **`ScheduleView.tsx`**: A presentational component responsible for displaying the generated schedule. It receives the schedule data as props and renders the list of sessions. It also contains logic for printing and displaying progress.
    -   **`SessionItem.tsx` (within `ScheduleView.tsx`)**: Renders an individual session in the timeline. It handles its own UI state, such as edit mode.
    -   **`Modal.tsx`**: A reusable modal component used for editing sessions and adding exams, promoting UI consistency.
    -   **`icons.tsx`**: A central file for SVG icons used across the application.

## State Management

-   **React Hooks**: State is managed locally within components using `useState` and `useCallback`.
-   **`useLocalStorage` Hook**: A custom hook is implemented to abstract the logic of reading from and writing to the browser's `localStorage`. This provides a simple and effective way to persist user data (schedules and exams) across sessions without needing a backend database.
-   **Top-Down Data Flow**: State is "lifted up" to the nearest common ancestor (`App.tsx`), and passed down to child components via props. Callbacks are used for child-to-parent communication.

## Services

-   **`services/geminiService.ts`**
    -   This service encapsulates all logic related to interacting with the external Google Gemini API.
    -   It is responsible for:
        -   Initializing the Gemini AI client.
        -   Constructing a detailed, structured prompt based on user input.
        -   Defining a JSON schema to ensure the API returns data in a predictable format.
        -   Making the API call to `generateContent`.
        -   Parsing the JSON response and handling potential API errors.
    -   This abstraction keeps API-specific logic separate from the UI components, making the application easier to maintain and test.

## PWA (Progressive Web App) Architecture

-   **`public/manifest.json`**: Defines the application's metadata for PWA installation, including name, icons, and display settings.
-   **`public/service-worker.js`**: Implements a caching strategy (cache-first, falling back to network). It intercepts network requests and serves assets from the cache, enabling the application to work offline and load faster on subsequent visits. Registration logic is included in `index.html`.

## Styling

-   **Tailwind CSS**: The application is styled exclusively with Tailwind CSS, loaded via a CDN. This utility-first approach allows for rapid UI development directly within the TSX components without writing separate CSS files. A print-specific stylesheet is embedded in `ScheduleView.tsx` to format the printed output.

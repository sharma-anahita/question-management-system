# Interactive Question Management Sheet

A single-page web application for managing a hierarchical set of questions organized by **topics** and **subtopics**.  
The application supports full CRUD operations, drag-and-drop reordering, progress tracking, and persistent state, with a clean and intuitive UI inspired by structured coding-preparation sheets (e.g., Codolio).

---

## ✨ Features

### Core Functionality
- **Create, rename, and delete**:
  - Topics
  - Subtopics
  - Questions
- **Drag-and-drop reordering** of questions within subtopics
- **Mark questions as completed**
- **Live progress tracking**:
  - Overall progress
  - Per-topic progress
  - Per-subtopic progress
- **Collapse / expand** topics and subtopics using arrow controls

### User Experience
- Clean **dark + pink themed UI**
- Centered “sheet-style” layout for focused interaction
- Smooth collapse and hover transitions
- Helpful empty states when no data is present
- Keyboard-friendly inline editing (Enter to save, Esc to cancel)

---

## 🛠 Tech Stack

- **React + TypeScript** (Vite)
- **Tailwind CSS** for styling
- **Zustand** for state management
- **@hello-pangea/dnd** for drag-and-drop interactions

---

## 🧠 State Management

- Global application state is managed using **Zustand**
- Stored state includes:
  - Topics, subtopics, and questions
  - Completion state
  - Collapse state
- Progress counts are **derived dynamically** from question completion state to avoid duplicated or inconsistent data

---

## 💾 Persistence

- Application state is persisted using **localStorage** via Zustand’s built-in `persist` middleware
- Persisted data:
  - Topics and subtopics
  - Questions
  - Completion state
  - Collapse state
- On load:
  - Persisted state is restored if available
  - Otherwise, the app initializes from the provided sample dataset

---

## 🔌 API Integration (Mocked)

A mock asynchronous API layer is implemented to demonstrate CRUD-style API integration without requiring a backend or database.

**Location:** `src/api/sheetApi.ts`

### Available API functions
- `getSheet()`
- `createTopic(title)`
- `renameTopic(oldTitle, newTitle)`
- `deleteTopic(title)`
- `createSubtopic(topicTitle, title)`
- `renameSubtopic(topicTitle, oldTitle, newTitle)`
- `deleteSubtopic(topicTitle, subtopicTitle)`
- `createQuestion(topicTitle, subtopicTitle, questionTitle)`
- `renameQuestion(topicTitle, subtopicTitle, questionKey, newTitle)`
- `deleteQuestion(topicTitle, subtopicTitle, questionKey)`

Each API function:
- Returns a `Promise`
- Simulates network latency with a small delay
- Internally updates the Zustand store

This satisfies the assignment requirement for API integration without adding unnecessary complexity.

---

## 📦 Sample Data

The application initializes using a provided `sheet.json` dataset, which is normalized into a hierarchical structure:


The dataset is used as initial state only and can be fully modified through the UI.

---

## 🚀 Running the Project Locally

```bash
npm install
npm run dev

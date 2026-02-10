# Interactive Question Management Sheet

A single-page web application for managing a hierarchical set of questions organized by **topics** and **subtopics**.  
The application supports CRUD operations, drag-and-drop reordering, progress tracking, and a clean, intuitive UI inspired by coding preparation sheets (e.g., Codolio).

---

## ✨ Features

### Core Functionality
- Add **Topics**, **Subtopics**, and **Questions**
- Mark questions as **completed**
- Live **progress tracking**
  - Overall progress
  - Per-topic progress
  - Per-subtopic progress
- **Collapse / expand** topics and subtopics using arrow controls
- **Drag-and-drop reordering** of questions within subtopics

### User Experience
- Clean **dark + pink themed UI**
- Centered “sheet-style” layout for focused interaction
- Smooth hover and collapse transitions
- Clear visual hierarchy and spacing

---

## 🛠 Tech Stack

- **React + TypeScript** (Vite)
- **Tailwind CSS** for styling
- **Zustand** for state management
- **@hello-pangea/dnd** for drag-and-drop interactions

---

## 🧠 State Management

- Global application state (topics, subtopics, questions, completion state, collapse state) is managed using **Zustand**
- Progress counts are **derived dynamically** from question completion state to avoid duplicated or inconsistent state

---

## 🔌 API Integration (Mocked)

A mock asynchronous API layer is implemented to demonstrate CRUD-style API integration without requiring a backend or database.

**Location:** `src/api/sheetApi.ts`

### Available API functions
- `getSheet()`
- `createTopic(title)`
- `createSubtopic(topicTitle, title)`
- `createQuestion(topicTitle, subtopicTitle, questionTitle)`

Each API function:
- Returns a `Promise`
- Simulates network latency using a small delay
- Internally updates the Zustand store

This satisfies the assignment requirement for API integration while keeping the project lightweight.

---

## 📦 Sample Data

The application initializes using a provided `sheet.json` dataset, which is normalized into a hierarchical structure:


The dataset is used only for initial state and demonstration purposes.

---

## 🚀 Running the Project Locally

```bash
npm install
npm run dev

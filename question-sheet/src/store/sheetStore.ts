import { create } from "zustand";
import sheetData from "../data/sheet.json";

// ── Types ──────────────────────────────────────────────

export interface QuestionItem {
  title: string;
  difficulty: string;
  link: string;
  _key: string;
}

export interface SubtopicItem {
  title: string;
  questions: QuestionItem[];
  completedCount: number;
  totalCount: number;
}

export interface TopicItem {
  title: string;
  subtopics: SubtopicItem[];
  completedCount: number;
  totalCount: number;
}

interface SheetState {
  topicsState: TopicItem[];
  completion: Record<string, boolean>;
  topicCollapsed: Record<string, boolean>;
  subtopicCollapsed: Record<string, boolean>;

  toggleTopicCollapse: (key: string) => void;
  toggleSubtopicCollapse: (key: string) => void;
  toggleQuestionComplete: (key: string) => void;
  addTopic: (title: string) => void;
  addSubtopic: (topicTitle: string, subtopicTitle: string) => void;
  addQuestion: (topicTitle: string, subtopicTitle: string, questionTitle: string) => void;
  reorderQuestions: (topicTitle: string, subtopicTitle: string, sourceIndex: number, destinationIndex: number) => void;
}

// ── Normalize sheet.json (runs once at import time) ────

function normalizeData() {
  const raw: any = sheetData;
  const questions: any[] = raw?.data?.questions ?? [];

  const topicsMap = new Map<string, Map<string, QuestionItem[]>>();
  const initialCompletion: Record<string, boolean> = {};

  for (const q of questions) {
    const topic = q.topic ?? "Untitled Topic";
    const subTopic = q.subTopic ?? "General";

    if (!topicsMap.has(topic)) topicsMap.set(topic, new Map());
    const subMap = topicsMap.get(topic)!;
    if (!subMap.has(subTopic)) subMap.set(subTopic, []);

    const qIndex = subMap.get(subTopic)!.length;
    const qKey = `${topic}||${subTopic}||${qIndex}`;

    const questionItem: QuestionItem = {
      title: q.title ?? q.questionId?.name ?? "Untitled",
      difficulty: q.questionId?.difficulty ?? "Unknown",
      link: q.questionId?.problemUrl ?? q.resource ?? "#",
      _key: qKey,
    };

    initialCompletion[qKey] = q.completed === true;
    subMap.get(subTopic)!.push(questionItem);
  }

  const topicsState: TopicItem[] = Array.from(topicsMap.entries()).map(
    ([title, subMap]) => {
      const subtopics: SubtopicItem[] = Array.from(subMap.entries()).map(
        ([subTitle, qs]) => ({
          title: subTitle,
          questions: qs,
          completedCount: qs.filter((x) => initialCompletion[x._key]).length,
          totalCount: qs.length,
        })
      );

      return {
        title,
        subtopics,
        completedCount: subtopics.reduce((s, st) => s + st.completedCount, 0),
        totalCount: subtopics.reduce((s, st) => s + st.totalCount, 0),
      };
    }
  );

  return { topicsState, initialCompletion };
}

const { topicsState: initialTopics, initialCompletion } = normalizeData();

// ── Store ──────────────────────────────────────────────

export const useSheetStore = create<SheetState>((set) => ({
  topicsState: initialTopics,
  completion: initialCompletion,
  topicCollapsed: {},
  subtopicCollapsed: {},

  toggleTopicCollapse: (key) =>
    set((s) => ({
      topicCollapsed: { ...s.topicCollapsed, [key]: !s.topicCollapsed[key] },
    })),

  toggleSubtopicCollapse: (key) =>
    set((s) => ({
      subtopicCollapsed: {
        ...s.subtopicCollapsed,
        [key]: !s.subtopicCollapsed[key],
      },
    })),

  toggleQuestionComplete: (key) =>
    set((s) => ({
      completion: { ...s.completion, [key]: !s.completion[key] },
    })),

  addTopic: (title) =>
    set((s) => ({
      topicsState: [
        ...s.topicsState,
        { title, subtopics: [], completedCount: 0, totalCount: 0 },
      ],
      topicCollapsed: { ...s.topicCollapsed, [title]: false },
    })),

  addSubtopic: (topicTitle, subtopicTitle) =>
    set((s) => ({
      topicsState: s.topicsState.map((t) => {
        if (t.title !== topicTitle) return t;
        const newSub: SubtopicItem = {
          title: subtopicTitle,
          questions: [],
          completedCount: 0,
          totalCount: 0,
        };
        return { ...t, subtopics: [...t.subtopics, newSub] };
      }),
      subtopicCollapsed: {
        ...s.subtopicCollapsed,
        [`${topicTitle}||${subtopicTitle}`]: false,
      },
    })),

  addQuestion: (topicTitle, subtopicTitle, questionTitle) =>
    set((s) => {
      let qKey = "";
      const topicsState = s.topicsState.map((t) => {
        if (t.title !== topicTitle) return t;
        return {
          ...t,
          subtopics: t.subtopics.map((st) => {
            if (st.title !== subtopicTitle) return st;
            const qIndex = st.questions.length;
            qKey = `${topicTitle}||${subtopicTitle}||${qIndex}`;
            const newQ: QuestionItem = {
              title: questionTitle,
              difficulty: "Unknown",
              link: "#",
              _key: qKey,
            };
            return { ...st, questions: [...st.questions, newQ] };
          }),
        };
      });
      return {
        topicsState,
        completion: { ...s.completion, [qKey]: false },
      };
    }),

  reorderQuestions: (topicTitle, subtopicTitle, sourceIndex, destinationIndex) =>
    set((s) => ({
      topicsState: s.topicsState.map((t) => {
        if (t.title !== topicTitle) return t;
        return {
          ...t,
          subtopics: t.subtopics.map((st) => {
            if (st.title !== subtopicTitle) return st;
            const reordered = [...st.questions];
            const [moved] = reordered.splice(sourceIndex, 1);
            reordered.splice(destinationIndex, 0, moved);
            return { ...st, questions: reordered };
          }),
        };
      }),
    })),
}));

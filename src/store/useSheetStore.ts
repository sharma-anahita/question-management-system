import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import sheetData from '../data/sheet.json';

export type Question = {
  id: string;
  title: string;
  difficulty?: string;
  problemUrl?: string;
  resource?: string;
};

export type SubTopic = {
  id: string;
  title: string;
  questions: Question[];
};

export type Topic = {
  id: string;
  title: string;
  subTopics: SubTopic[];
  collapsed?: boolean;
};

type SheetStore = {
  topics: Topic[];
  
  // Topic operations
  addTopic: (title: string) => void;
  updateTopic: (id: string, title: string) => void;
  deleteTopic: (id: string) => void;
  toggleTopicCollapse: (id: string) => void;
  reorderTopics: (startIndex: number, endIndex: number) => void;
  
  // SubTopic operations
  addSubTopic: (topicId: string, title: string) => void;
  updateSubTopic: (topicId: string, subTopicId: string, title: string) => void;
  deleteSubTopic: (topicId: string, subTopicId: string) => void;
  reorderSubTopics: (topicId: string, startIndex: number, endIndex: number) => void;
  
  // Question operations
  addQuestion: (topicId: string, subTopicId: string, question: Omit<Question, 'id'>) => void;
  updateQuestion: (topicId: string, subTopicId: string, questionId: string, question: Partial<Question>) => void;
  deleteQuestion: (topicId: string, subTopicId: string, questionId: string) => void;
  reorderQuestions: (topicId: string, subTopicId: string, startIndex: number, endIndex: number) => void;
};

const normalizeData = (): Topic[] => {
  const topicsMap = new Map<string, Topic>();
  
  sheetData.data.questions.forEach((q) => {
    const topicTitle = q.topic;
    const subTopicTitle = q.subTopic;
    
    if (!topicsMap.has(topicTitle)) {
      topicsMap.set(topicTitle, {
        id: `topic-${topicTitle.toLowerCase().replace(/\s+/g, '-')}`,
        title: topicTitle,
        subTopics: [],
        collapsed: false,
      });
    }
    
    const topic = topicsMap.get(topicTitle)!;
    let subTopic = topic.subTopics.find(st => st.title === subTopicTitle);
    
    if (!subTopic) {
      subTopic = {
        id: `subtopic-${topicTitle}-${subTopicTitle}`.toLowerCase().replace(/\s+/g, '-'),
        title: subTopicTitle,
        questions: [],
      };
      topic.subTopics.push(subTopic);
    }
    
    subTopic.questions.push({
      id: q._id,
      title: q.title,
      difficulty: q.questionId?.difficulty,
      problemUrl: q.questionId?.problemUrl,
      resource: q.resource ?? undefined,
    });
  });
  
  return Array.from(topicsMap.values());
};

export const useSheetStore = create<SheetStore>()(
  persist(
    (set) => ({
      topics: normalizeData(),
      
      addTopic: (title) => set((state) => ({
        topics: [...state.topics, {
          id: `topic-${Date.now()}`,
          title,
          subTopics: [],
          collapsed: false,
        }],
      })),
      
      updateTopic: (id, title) => set((state) => ({
        topics: state.topics.map(t => t.id === id ? { ...t, title } : t),
      })),
      
      deleteTopic: (id) => set((state) => ({
        topics: state.topics.filter(t => t.id !== id),
      })),
      
      toggleTopicCollapse: (id) => set((state) => ({
        topics: state.topics.map(t => t.id === id ? { ...t, collapsed: !t.collapsed } : t),
      })),
      
      reorderTopics: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.topics);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { topics: result };
      }),
      
      addSubTopic: (topicId, title) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? {
          ...t,
          subTopics: [...t.subTopics, {
            id: `subtopic-${Date.now()}`,
            title,
            questions: [],
          }],
        } : t),
      })),
      
      updateSubTopic: (topicId, subTopicId, title) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? {
          ...t,
          subTopics: t.subTopics.map(st => st.id === subTopicId ? { ...st, title } : st),
        } : t),
      })),
      
      deleteSubTopic: (topicId, subTopicId) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? {
          ...t,
          subTopics: t.subTopics.filter(st => st.id !== subTopicId),
        } : t),
      })),
      
      reorderSubTopics: (topicId, startIndex, endIndex) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          const result = Array.from(t.subTopics);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { ...t, subTopics: result };
        }),
      })),
      
      addQuestion: (topicId, subTopicId, question) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? {
          ...t,
          subTopics: t.subTopics.map(st => st.id === subTopicId ? {
            ...st,
            questions: [...st.questions, { ...question, id: `q-${Date.now()}` }],
          } : st),
        } : t),
      })),
      
      updateQuestion: (topicId, subTopicId, questionId, question) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? {
          ...t,
          subTopics: t.subTopics.map(st => st.id === subTopicId ? {
            ...st,
            questions: st.questions.map(q => q.id === questionId ? { ...q, ...question } : q),
          } : st),
        } : t),
      })),
      
      deleteQuestion: (topicId, subTopicId, questionId) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? {
          ...t,
          subTopics: t.subTopics.map(st => st.id === subTopicId ? {
            ...st,
            questions: st.questions.filter(q => q.id !== questionId),
          } : st),
        } : t),
      })),
      
      reorderQuestions: (topicId, subTopicId, startIndex, endIndex) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: t.subTopics.map(st => {
              if (st.id !== subTopicId) return st;
              const result = Array.from(st.questions);
              const [removed] = result.splice(startIndex, 1);
              result.splice(endIndex, 0, removed);
              return { ...st, questions: result };
            }),
          };
        }),
      })),
    }),
    {
      name: 'question-sheet-storage',
    }
  )
);
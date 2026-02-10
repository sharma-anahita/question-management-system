import { useSheetStore } from "../store/sheetStore";
import type { TopicItem } from "../store/sheetStore";

const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function getSheet(): Promise<TopicItem[]> {
  await delay();
  return useSheetStore.getState().topicsState;
}

export async function createTopic(title: string): Promise<void> {
  await delay();
  useSheetStore.getState().addTopic(title);
}

export async function createSubtopic(topicTitle: string, title: string): Promise<void> {
  await delay();
  useSheetStore.getState().addSubtopic(topicTitle, title);
}

export async function createQuestion(
  topicTitle: string,
  subtopicTitle: string,
  questionTitle: string,
): Promise<void> {
  await delay();
  useSheetStore.getState().addQuestion(topicTitle, subtopicTitle, questionTitle);
}

export async function deleteSubtopic(topicTitle: string, subtopicTitle: string): Promise<void> {
  await delay();
  useSheetStore.getState().deleteSubtopic(topicTitle, subtopicTitle);
}

export async function deleteTopic(topicTitle: string): Promise<void> {
  await delay();
  useSheetStore.getState().deleteTopic(topicTitle);
}

export async function deleteQuestion(topicTitle: string, subtopicTitle: string, questionKey: string): Promise<void> {
  await delay();
  useSheetStore.getState().deleteQuestion(topicTitle, subtopicTitle, questionKey);
}

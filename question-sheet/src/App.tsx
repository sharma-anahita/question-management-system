import SheetLayout from "./components/SheetLayout";
import TopicCard from "./components/TopicCard";
import SubtopicCard from "./components/SubtopicCard";
import QuestionRow from "./components/QuestionRow";
import ProgressLine from "./components/ProgressLine";
import { useSheetStore } from "./store/sheetStore";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { createTopic, createSubtopic, createQuestion, deleteSubtopic, deleteTopic, deleteQuestion, renameTopic, renameSubtopic, renameQuestion } from "./api/sheetApi";

export default function App() {
  const {
    topicsState,
    completion,
    topicCollapsed,
    subtopicCollapsed,
    toggleTopicCollapse,
    toggleSubtopicCollapse,
    toggleQuestionComplete,
    reorderQuestions,
  } = useSheetStore();

  // UI-only local state for creation inputs
  const [addingTopic, setAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [addingSubtopicFor, setAddingSubtopicFor] = useState<string | null>(null);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState("");
  const [addingQuestionFor, setAddingQuestionFor] = useState<string | null>(null);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");

  // derive counts live from questions + completion map
  let overallTotal = 0;
  let overallCompleted = 0;
  for (const t of topicsState) {
    for (const s of t.subtopics) {
      const subTotal = (s.questions ?? []).length;
      overallTotal += subTotal;
      overallCompleted += (s.questions ?? []).reduce((acc: number, q) => acc + (completion[q._key] ? 1 : 0), 0);
    }
  }

  const addTopic = () => {
    const title = newTopicTitle.trim();
    if (!title) return;
    void createTopic(title);
    setNewTopicTitle("");
    setAddingTopic(false);
  };

  const addSubtopic = (topicTitle: string) => {
    const title = newSubtopicTitle.trim();
    if (!title) return;
    void createSubtopic(topicTitle, title);
    setNewSubtopicTitle("");
    setAddingSubtopicFor(null);
  };

  const addQuestion = (topicTitle: string, subtopicTitle: string) => {
    const title = newQuestionTitle.trim();
    if (!title) return;
    void createQuestion(topicTitle, subtopicTitle, title);
    setNewQuestionTitle("");
    setAddingQuestionFor(null);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    // droppableId is the sKey: "topicTitle||subtopicTitle"
    const parts = result.source.droppableId.split("||");
    const topicTitle = parts[0];
    const subtopicTitle = parts[1];
    reorderQuestions(topicTitle, subtopicTitle, result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
    <SheetLayout>
      <div className="mb-4 flex items-center gap-3">
        {!addingTopic ? (
          <button
            type="button"
            className="text-pink-400 hover:text-pink-300"
            onClick={() => setAddingTopic(true)}
          >
            Add Topic
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              className="px-2 py-1 rounded bg-[#0f0f0f] text-white"
              placeholder="Topic name"
            />
            <button type="button" className="text-pink-400" onClick={addTopic}>Save</button>
            <button type="button" className="text-gray-400" onClick={() => { setAddingTopic(false); setNewTopicTitle(""); }}>Cancel</button>
          </div>
        )}
      </div>

      <ProgressLine completedCount={overallCompleted} totalCount={overallTotal} />

      {topicsState.map((topic) => {
        const tKey = topic.title;
        const tCollapsed = !!topicCollapsed[tKey];

        // compute counts for this topic from its subtopics/questions
        let topicTotal = 0;
        let topicCompleted = 0;
        for (const st of topic.subtopics) {
          const subTotal = (st.questions ?? []).length;
          const subCompleted = (st.questions ?? []).reduce((acc: number, q) => acc + (completion[q._key] ? 1 : 0), 0);
          topicTotal += subTotal;
          topicCompleted += subCompleted;
        }

        return (
          <TopicCard key={tKey} title={topic.title} completedCount={topicCompleted} totalCount={topicTotal} isCollapsed={tCollapsed} onToggle={() => toggleTopicCollapse(tKey)} onAddSubtopic={() => setAddingSubtopicFor(topic.title)} onDelete={() => void deleteTopic(topic.title)} onRename={(newTitle) => void renameTopic(topic.title, newTitle)}>
            {topic.subtopics.map((st) => {
              const sKey = `${topic.title}||${st.title}`;
              const sCollapsed = !!subtopicCollapsed[sKey];

              const subTotal = (st.questions ?? []).length;
              const subCompleted = (st.questions ?? []).reduce((acc: number, q) => acc + (completion[q._key] ? 1 : 0), 0);

              return (
                <SubtopicCard key={sKey} title={st.title} completedCount={subCompleted} totalCount={subTotal} isCollapsed={sCollapsed} onToggle={() => toggleSubtopicCollapse(sKey)} onAddQuestion={() => setAddingQuestionFor(sKey)} onDelete={() => void deleteSubtopic(topic.title, st.title)} onRename={(newTitle) => void renameSubtopic(topic.title, st.title, newTitle)}>
                  <Droppable droppableId={sKey}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {st.questions.map((q, index) => {
                          const k = q._key;
                          return (
                            <Draggable key={k} draggableId={k} index={index}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <QuestionRow
                                    title={q.title}
                                    difficulty={q.difficulty}
                                    link={q.link}
                                    completed={!!completion[k]}
                                    onToggleComplete={() => toggleQuestionComplete(k)}
                                    onDelete={() => void deleteQuestion(topic.title, st.title, k)}
                                    onRename={(newTitle) => void renameQuestion(topic.title, st.title, k, newTitle)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  {addingQuestionFor === sKey && (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        value={newQuestionTitle}
                        onChange={(e) => setNewQuestionTitle(e.target.value)}
                        className="px-2 py-1 rounded bg-[#0f0f0f] text-white text-sm"
                        placeholder="Question title"
                      />
                      <button type="button" className="text-xs text-pink-400" onClick={() => addQuestion(topic.title, st.title)}>Save</button>
                      <button type="button" className="text-xs text-gray-400" onClick={() => { setAddingQuestionFor(null); setNewQuestionTitle(""); }}>Cancel</button>
                    </div>
                  )}
                </SubtopicCard>
              );
            })}

            {/* Add Subtopic input */}
            {addingSubtopicFor === topic.title && (
              <div className="px-4 py-2">
                <input
                  value={newSubtopicTitle}
                  onChange={(e) => setNewSubtopicTitle(e.target.value)}
                  className="px-2 py-1 rounded bg-[#0f0f0f] text-white"
                  placeholder="Subtopic name"
                />
                <button type="button" className="ml-2 text-pink-400" onClick={() => addSubtopic(topic.title)}>Save</button>
                <button type="button" className="ml-2 text-gray-400" onClick={() => { setAddingSubtopicFor(null); setNewSubtopicTitle(""); }}>Cancel</button>
              </div>
            )}
          </TopicCard>
        );
      })}
    </SheetLayout>
    </DragDropContext>
  );
}

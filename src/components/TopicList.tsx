import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useSheetStore } from '../store/useSheetStore';
import { TopicItem } from './TopicItem.tsx';
import { useState } from 'react';

export const TopicList = () => {
  const {
    topics,
    addTopic,
    updateTopic,
    deleteTopic,
    toggleTopicCollapse,
    reorderTopics,
    addSubTopic,
    updateSubTopic,
    deleteSubTopic,
    reorderSubTopics,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
  } = useSheetStore();

  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const handleAddTopic = () => {
    if (newTopicTitle.trim()) {
      addTopic(newTopicTitle);
      setNewTopicTitle('');
      setShowAddTopic(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'topic') {
      reorderTopics(source.index, destination.index);
    } else if (type === 'subtopic') {
      reorderSubTopics(source.droppableId, source.index, destination.index);
    } else if (type === 'question') {
      const topicId = topics.find(t => t.subTopics.some(st => st.id === source.droppableId))?.id;
      if (topicId) {
        reorderQuestions(topicId, source.droppableId, source.index, destination.index);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">📚 Question Management Sheet</h1>
        <button
          onClick={() => setShowAddTopic(!showAddTopic)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium"
        >
          ➕ Add Topic
        </button>
      </div>

      {showAddTopic && (
        <div className="mb-6 flex gap-2 bg-white p-4 rounded-lg border shadow-sm">
          <input
            type="text"
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
            placeholder="Topic title..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleAddTopic}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 font-medium"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowAddTopic(false);
              setNewTopicTitle('');
            }}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-topics" type="topic">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {topics.map((topic, index) => (
                <TopicItem
                  key={topic.id}
                  topic={topic}
                  index={index}
                  onUpdate={updateTopic}
                  onDelete={deleteTopic}
                  onToggleCollapse={toggleTopicCollapse}
                  onAddSubTopic={addSubTopic}
                  onUpdateSubTopic={updateSubTopic}
                  onDeleteSubTopic={deleteSubTopic}
                  onAddQuestion={addQuestion}
                  onUpdateQuestion={updateQuestion}
                  onDeleteQuestion={deleteQuestion}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
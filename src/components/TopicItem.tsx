import { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import type { Topic, Question } from '../store/useSheetStore';
import { SubTopicItem } from './SubTopicItem';

type TopicItemProps = {
  topic: Topic;
  index: number;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onAddSubTopic: (topicId: string, title: string) => void;
  onUpdateSubTopic: (topicId: string, subTopicId: string, title: string) => void;
  onDeleteSubTopic: (topicId: string, subTopicId: string) => void;
  onAddQuestion: (topicId: string, subTopicId: string, question: Omit<Question, 'id'>) => void;
  onUpdateQuestion: (topicId: string, subTopicId: string, questionId: string, question: Partial<Question>) => void;
  onDeleteQuestion: (topicId: string, subTopicId: string, questionId: string) => void;
};

export const TopicItem = ({
  topic,
  index,
  onUpdate,
  onDelete,
  onToggleCollapse,
  onAddSubTopic,
  onUpdateSubTopic,
  onDeleteSubTopic,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}: TopicItemProps) => {
  const [showAddSubTopic, setShowAddSubTopic] = useState(false);
  const [newSubTopicTitle, setNewSubTopicTitle] = useState('');

  const handleAddSubTopic = () => {
    if (newSubTopicTitle.trim()) {
      onAddSubTopic(topic.id, newSubTopicTitle.trim());
      setNewSubTopicTitle('');
      setShowAddSubTopic(false);
    }
  };

  return (
    <Draggable draggableId={topic.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-6 rounded-lg shadow-sm overflow-hidden ${snapshot.isDragging ? 'ring-2 ring-blue-300' : 'ring-0'}`}
        >
          <div
            {...provided.dragHandleProps}
            className="px-4 py-3 bg-gradient-to-r from-white to-gray-50 flex items-center justify-between"
          >
            <div className="flex-1 flex items-center gap-4">
              <div className="text-2xl">📘</div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{topic.title}</h2>
                <div className="text-sm text-gray-500 mt-0.5">{topic.subTopics.length} subtopics • {topic.subTopics.reduce((acc, s) => acc + s.questions.length, 0)} questions</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onToggleCollapse(topic.id)} className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">{topic.collapsed ? 'Expand' : 'Collapse'}</button>
              <button onClick={() => {
                const newTitle = window.prompt('Rename topic', topic.title);
                if (newTitle && newTitle.trim()) onUpdate(topic.id, newTitle.trim());
              }} className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50">Rename</button>
              <button onClick={() => setShowAddSubTopic(!showAddSubTopic)} className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100">+ Subtopic</button>
              <button onClick={() => onDelete(topic.id)} className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100">Delete</button>
            </div>
          </div>

          {showAddSubTopic && (
            <div className="p-3 bg-white border-t flex gap-2 items-center">
              <input
                type="text"
                value={newSubTopicTitle}
                onChange={(e) => setNewSubTopicTitle(e.target.value)}
                placeholder="Sub-topic title..."
                className="flex-1 border border-gray-200 rounded px-3 py-2"
              />
              <div className="flex gap-2">
                <button onClick={handleAddSubTopic} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                <button onClick={() => setShowAddSubTopic(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
              </div>
            </div>
          )}

          {!topic.collapsed && (
            <Droppable droppableId={topic.id} type="subtopic">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="p-3 bg-white space-y-3">
                  {topic.subTopics.map((st, idx) => (
                    <SubTopicItem
                      key={st.id}
                      subTopic={st}
                      index={idx}
                      topicId={topic.id}
                      onUpdate={onUpdateSubTopic}
                      onDelete={onDeleteSubTopic}
                      onAddQuestion={onAddQuestion}
                      onUpdateQuestion={onUpdateQuestion}
                      onDeleteQuestion={onDeleteQuestion}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  );
};

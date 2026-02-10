import { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import type { SubTopic, Question } from '../store/useSheetStore';
import { QuestionItem } from './QuestionItem';

type SubTopicItemProps = {
  subTopic: SubTopic;
  index: number;
  topicId: string;
  onUpdate: (topicId: string, subTopicId: string, title: string) => void;
  onDelete: (topicId: string, subTopicId: string) => void;
  onAddQuestion: (topicId: string, subTopicId: string, question: Omit<Question, 'id'>) => void;
  onUpdateQuestion: (topicId: string, subTopicId: string, questionId: string, question: Partial<Question>) => void;
  onDeleteQuestion: (topicId: string, subTopicId: string, questionId: string) => void;
};

export const SubTopicItem = ({
  subTopic,
  index,
  topicId,
  onUpdate,
  onDelete,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}: SubTopicItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(subTopic.title);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(topicId, subTopic.id, title.trim());
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Delete this sub-topic and all its questions?')) {
      onDelete(topicId, subTopic.id);
    }
  };

  const handleAddQuestion = () => {
    if (newQuestionTitle.trim()) {
      onAddQuestion(topicId, subTopic.id, { title: newQuestionTitle.trim() });
      setNewQuestionTitle('');
      setShowAddQuestion(false);
    }
  };

  return (
    <Draggable draggableId={subTopic.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`border rounded-md overflow-hidden ${snapshot.isDragging ? 'ring-2 ring-blue-200' : ''}`}
        >
          <div
            {...provided.dragHandleProps}
            className="flex items-center justify-between px-4 py-3 bg-gray-50"
          >
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-xl">📂</div>
                  <div>
                    <h3 className="font-semibold text-gray-700">{subTopic.title}</h3>
                    <div className="text-sm text-gray-500">{subTopic.questions.length} questions</div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setShowAddQuestion(!showAddQuestion)}
                className="px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 text-sm"
              >
                ➕ Add
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm"
              >
                🗑 Delete
              </button>
            </div>
          </div>

          {showAddQuestion && (
            <div className="px-4 py-3 bg-white border-t flex gap-2">
              <input
                type="text"
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
                placeholder="Question title..."
                className="flex-1 border border-gray-200 rounded px-3 py-2"
                autoFocus
              />
              <button
                onClick={handleAddQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddQuestion(false);
                  setNewQuestionTitle('');
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          )}

          <Droppable droppableId={subTopic.id} type="question">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="px-4 py-3 bg-white space-y-2">
                {subTopic.questions.map((question, qIndex) => (
                  <QuestionItem
                    key={question.id}
                    question={question}
                    index={qIndex}
                    topicId={topicId}
                    subTopicId={subTopic.id}
                    onUpdate={onUpdateQuestion}
                    onDelete={onDeleteQuestion}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

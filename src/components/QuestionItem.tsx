import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import type { Question } from '../store/useSheetStore';

type QuestionItemProps = {
  question: Question;
  index: number;
  topicId: string;
  subTopicId: string;
  onUpdate: (topicId: string, subTopicId: string, questionId: string, question: Partial<Question>) => void;
  onDelete: (topicId: string, subTopicId: string, questionId: string) => void;
};

export const QuestionItem = ({ question, index, topicId, subTopicId, onUpdate, onDelete }: QuestionItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(question.title);

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(topicId, subTopicId, question.id, { title });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Delete this question?')) {
      onDelete(topicId, subTopicId, question.id);
    }
  };

  return (
    <Draggable draggableId={question.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center justify-between gap-4 p-3 rounded-md border bg-white ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'} transition`}
        >
          <div className="flex-1 flex items-center gap-4">
            <div className="w-10 flex flex-col items-center">
              <div className={`px-2 py-0.5 rounded text-xs font-semibold ${
                question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>{question.difficulty ?? '—'}</div>
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="border border-gray-300 rounded px-2 py-1 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 truncate">{question.title}</div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                    {question.resource && <a href={question.resource} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">📚 Resource</a>}
                    {question.problemUrl && <a href={question.problemUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">🔗 Problem</a>}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
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
      )}
    </Draggable>
  );
};
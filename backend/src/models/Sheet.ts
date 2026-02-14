import { Schema, model, Document, Types } from 'mongoose';

interface IQuestion {
  id?: string;
  text: string;
  answer?: string;
}

interface ISubtopic {
  title: string;
  questions: IQuestion[];
}

interface ITopic {
  title: string;
  subtopics: ISubtopic[];
}

export interface ISheet extends Document {
  owner: Types.ObjectId;
  topics: ITopic[];
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  answer: { type: String }
});

const SubtopicSchema = new Schema<ISubtopic>({
  title: { type: String, required: true },
  questions: { type: [QuestionSchema], default: [] }
});

const TopicSchema = new Schema<ITopic>({
  title: { type: String, required: true },
  subtopics: { type: [SubtopicSchema], default: [] }
});

const sheetSchema = new Schema<ISheet>({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  topics: { type: [TopicSchema], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

export default model<ISheet>('Sheet', sheetSchema);

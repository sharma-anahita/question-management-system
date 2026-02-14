import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import sheetRoutes from './routes/sheet';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sheet', sheetRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

export default app;

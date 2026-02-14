import { Request, Response } from 'express';
import Sheet from '../models/Sheet';

export async function getSheet(req: Request, res: Response) {
  try {
    const owner = req.userId;
    if (!owner) return res.status(401).json({ message: 'Unauthorized' });

    const sheet = await Sheet.findOne({ owner });
    if (!sheet) return res.json({ topics: [] });
    res.json(sheet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function upsertSheet(req: Request, res: Response) {
  try {
    const owner = req.userId;
    if (!owner) return res.status(401).json({ message: 'Unauthorized' });

    const payload = req.body;
    const updated = await Sheet.findOneAndUpdate(
      { owner },
      { $set: { topics: payload.topics || [], updatedAt: new Date() } },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

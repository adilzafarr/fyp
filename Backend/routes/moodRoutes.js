import express from 'express';
import * as mood from '../controllers/moodController.js';

const router = express.Router();

router.post('/get-mood-history', mood.getMoodHistory);

export default router;
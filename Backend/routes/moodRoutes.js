const express = require('express');
const router = express.Router();
const mood = require('../controllers/moodController');

router.post('/get-mood-history', mood.getMoodHistory);

module.exports = router;
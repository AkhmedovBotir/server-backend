const express = require('express');
const { startGame, moveGame, endGame } = require('../controllers/gameController'); // Controllerlar
const authMiddleware = require('../middleware/authMiddleware'); // Autentifikatsiya qilish uchun middleware

const router = express.Router();

// O'yin boshlash
router.post('/:lobbyId/start', authMiddleware, startGame);

// O'yinda harakat qilish
router.post('/:gameId/move', authMiddleware, moveGame);

// O'yinni tugatish
router.post('/:gameId/end', authMiddleware, endGame);

module.exports = router;

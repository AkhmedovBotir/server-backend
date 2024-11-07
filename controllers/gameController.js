const Game = require('../models/Game');
const Lobby = require('../models/Lobby');

// O'yin boshlash
const startGame = async (req, res) => {
  const { lobbyId } = req.params;
  try {
    const lobby = await Lobby.findById(lobbyId);
    if (!lobby || lobby.state !== 'in_progress') {
      return res.status(400).send('Lobby hali o\'yin uchun tayyor emas');
    }

    // Yangi o'yin yaratish
    const game = new Game({
      lobbyId: lobbyId,
      players: lobby.players,
      state: 'in_progress',
    });

    await game.save();

    // Real-time yangilanishlar yuborish
    io.emit('gameStarted', game._id);

    res.status(200).json(game);
  } catch (err) {
    res.status(500).send('O\'yin boshlashda xato yuz berdi');
  }
};

// O'yinda harakat qilish
const moveGame = async (req, res) => {
  const { gameId } = req.params;
  const { move } = req.body; // Harakat (masalan, "move up", "move down")

  try {
    const game = await Game.findById(gameId);
    if (!game || game.state !== 'in_progress') {
      return res.status(400).send('O\'yin hali boshqarilmayapti');
    }

    // Harakatni saqlash
    game.moves.push({ player: req.user.id, move: move, timestamp: new Date() });
    await game.save();

    // Real-time yangilanishlar yuborish
    io.emit('gameMove', { gameId, move });

    res.status(200).json(game);
  } catch (err) {
    res.status(500).send('Harakatda xato yuz berdi');
  }
};

// O'yinni tugatish
const endGame = async (req, res) => {
  const { gameId } = req.params;
  const { winnerId } = req.body; // G'olib foydalanuvchi ID

  try {
    const game = await Game.findById(gameId);
    if (!game || game.state === 'finished') {
      return res.status(400).send('O\'yin allaqachon tugagan');
    }

    game.state = 'finished';
    game.winner = winnerId;
    await game.save();

    // Real-time yangilanishlar yuborish
    io.emit('gameFinished', { gameId, winnerId });

    res.status(200).json(game);
  } catch (err) {
    res.status(500).send('O\'yinni tugatishda xato yuz berdi');
  }
};

module.exports = { startGame, moveGame, endGame };

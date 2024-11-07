const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  lobbyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lobby',
    required: true
  },
  players: [
    {
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Foydalanuvchi modeliga referans
        required: true
      },
      username: String,
      status: { type: String, enum: ['active', 'inactive'], default: 'active' } // Foydalanuvchi holati
    }
  ],
  moves: [
    {
      player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      move: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  state: { type: String, enum: ['waiting', 'in_progress', 'finished'], default: 'waiting' },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;

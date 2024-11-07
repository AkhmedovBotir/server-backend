const mongoose = require('mongoose');

const lobbySchema = new mongoose.Schema({
  name: { type: String, required: true },
  players: [
    {
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Foydalanuvchi modeliga referans
        required: true
      },
      username: String
    }
  ],
  state: { type: String, enum: ['waiting', 'in_progress'], default: 'waiting' }, // Lobby holati
  maxPlayers: { type: Number, default: 4 }, // Maksimal o'yinchilar soni
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    default: null // O'yin hali boshlanmagan
  }
}, { timestamps: true });

const Lobby = mongoose.model('Lobby', lobbySchema);

module.exports = Lobby;

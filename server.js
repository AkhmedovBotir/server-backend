const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");

const gameRoutes = require('./routes/gameRoutes'); // Game route'lari
const authMiddleware = require('./middleware/authMiddleware'); // Foydalanuvchi tekshiruvi uchun middleware

const cors = require('cors');

// Muhit sozlamalarini yuklaymiz
dotenv.config();
connectDB();

const app = express();

// JSON ma’lumotlarini o‘qish uchun middleware
app.use(express.json());
app.use(cors());

// Foydalanuvchi autentifikatsiyasi yo‘llari
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/game', gameRoutes);

// Lobby yo‘llari
app.use("/api/lobby", require("./routes/lobbyRoutes"));

// HTTP va Socket.IO server yaratish
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Socket.IO funksiyalarini sozlash
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinLobby", (lobbyId) => {
    socket.join(lobbyId);
    io.to(lobbyId).emit("message", "A user has joined the lobby");
  });

  socket.on("leaveLobby", (lobbyId) => {
    socket.leave(lobbyId);
    io.to(lobbyId).emit("message", "A user has left the lobby");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

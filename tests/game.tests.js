const request = require('supertest');
const app = require('../server'); // Serverni import qilish

describe('Game API', () => {
  let gameId, lobbyId, userId;

  // Lobby yaratish testlari
  it('should create a new lobby', async () => {
    const response = await request(app)
      .post('/api/lobby')
      .send({
        name: 'Test Lobby',
        maxPlayers: 4
      });

    expect(response.status).toBe(201);
    lobbyId = response.body._id; // Lobby ID saqlanadi
  });

  // Lobbyga o'yinchi qo'shish testlari
  it('should join a lobby', async () => {
    const response = await request(app)
      .post(`/api/lobby/${lobbyId}`)
      .send({
        userId: 'some-user-id',
        username: 'testuser'
      });

    expect(response.status).toBe(200);
    expect(response.body.players.length).toBe(1); // O'yinchi qo'shildi
  });

  // O'yin boshlash testlari
  it('should start the game', async () => {
    const response = await request(app)
      .post(`/api/game/${lobbyId}/start`);

    expect(response.status).toBe(200);
    gameId = response.body._id; // O'yin ID saqlanadi
  });

  // Harakat yuborish testlari
  it('should make a move', async () => {
    const response = await request(app)
      .post(`/api/game/${gameId}/move`)
      .send({
        move: 'A1'
      });

    expect(response.status).toBe(200);
  });

  // O'yinni tugatish testlari
  it('should end the game', async () => {
    const response = await request(app)
      .post(`/api/game/${gameId}/end`)
      .send({
        winnerId: 'some-user-id'
      });

    expect(response.status).toBe(200);
  });
});

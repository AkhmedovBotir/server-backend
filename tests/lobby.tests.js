const request = require('supertest');
const app = require('../server'); // Serverni import qilish

describe('Lobby API', () => {
  let lobbyId;

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
});

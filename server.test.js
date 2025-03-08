const request = require('supertest');
const {app, connectDB} = require('./api/notes'); // アプリケーション、DB接続のエクスポート
const mongoose = require('mongoose');

beforeAll(async () => {
    await connectDB();  // テストの前にDB接続
  });

describe('POST /notes', () => {
  it('should create a new note', async () => {
    const response = await request(app)
      .post('/notes')
      .send({ title: 'Test Note', content: 'This is a test note.' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Test Note');
    expect(response.body.content).toBe('This is a test note.');
  });

  it('should return 400 if title or content is missing', async () => {
    const response = await request(app)
      .post('/notes')
      .send({ title: 'Test Note' }); // contentがない場合
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title and content are required / タイトルは10文字以内、内容は100文字以内で入力してください');
  });

  it('should return 400 if title or content is missing', async () => {
    const response = await request(app)
      .post('/notes')
      .send({ content: 'Test Note' }); // contentがない場合
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title and content are required / タイトルは10文字以内、内容は100文字以内で入力してください');
  });
});


describe('GET /notes', () => {
  it('should return all notes', async () => {
    const response = await request(app).get('/notes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

afterAll(async () => {
    await mongoose.connection.close();  // MongoDB接続を終了
  });
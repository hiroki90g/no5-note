// server.js (または app.js)
const express = require('express');
const connectDB = require('./config/db'); // db.jsのインポート
const { body, validationResult } = require('express-validator'); // バリデーション用

const Note = require('./models/Note'); // ノートモデル

const app = express();
app.use(express.json()); // JSONリクエストを処理するために追加

// // MongoDB接続
// connectDB();

// ルートエンドポイント
app.get('/', (req, res) => {
  res.send('Hello, world!');
});
// ノートの作成
app.post('/notes',
    body('title').notEmpty().withMessage('タイトルを入力してください').isLength({ max: 10 }).withMessage('タイトルは10文字以内で入力してください'),
    body('content').notEmpty().withMessage('内容を入力してください').isLength({ max: 100 }).withMessage('内容は100文字以内で入力してください'),
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Title and content are required / タイトルは10文字以内、内容は100文字以内で入力してください' });
    }

    const { title, content } = req.body;
    const newNote = new Note({ title, content });

    try{
        await newNote.save();
        res.status(201).json(newNote);
    }catch(err){
        res.status(400).json({ error: 'Title and content are required / タイトルは10文字以内、内容は100文字以内で入力してください' });
    }
});


// ノートの一覧取得
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

// ノートの更新
app.put('/notes/:id',
    body('title').notEmpty().withMessage('タイトルを入力してください').isLength({ max: 10 }).withMessage('タイトルは10文字以内で入力してください'),
    body('content').notEmpty().withMessage('内容を入力してください').isLength({ max: 100 }).withMessage('内容は100文字以内で入力してください'),
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: "Title and content are required / タイトルは10文字以内、内容は100文字以内で入力してください" });
    }

    const { title,content } = req.body;
    try{
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id, 
            { title, content, updatedAt: Date.now() }, 
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ error: 'ノートが見つかりません' });
        }
        res.json(updatedNote);
    }catch(err){
        res.status(400).json({ error: err.message });
    }
});

// ノートの削除
app.delete('/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// // サーバー起動
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = { app, connectDB };

const { body, validationResult } = require('express-validator');
const connectDB = require('../config/db');
const Note = require('../models/Note');

module.exports = async (req, res) => {
    await connectDB(); // MongoDB接続

    // POSTリクエスト（ノートの作成）
    if (req.method === 'POST') {
        await body('title').notEmpty().withMessage('タイトルを入力してください').isLength({ max: 10 }).withMessage('タイトルは10文字以内で入力してください').run(req);
        await body('content').notEmpty().withMessage('内容を入力してください').isLength({ max: 100 }).withMessage('内容は100文字以内で入力してください').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Title and content are required / タイトルは10文字以内、内容は100文字以内で入力してください' });
        }

        const { title, content } = req.body;
        const newNote = new Note({ title, content });

        try {
            await newNote.save();
            res.status(201).json(newNote);
        } catch (err) {
            res.status(400).json({ error: 'Error saving note' });
        }
    }

    // GETリクエスト（ノート一覧の取得）
    else if (req.method === 'GET') {
        try {
            const notes = await Note.find();
            res.status(200).json(notes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // PUTリクエスト（ノートの更新）
    else if (req.method === 'PUT') {
        const { id } = req.query;
        await body('title').notEmpty().withMessage('タイトルを入力してください').isLength({ max: 10 }).withMessage('タイトルは10文字以内で入力してください').run(req);
        await body('content').notEmpty().withMessage('内容を入力してください').isLength({ max: 100 }).withMessage('内容は100文字以内で入力してください').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Title and content are required / タイトルは10文字以内、内容は100文字以内で入力してください' });
        }

        const { title, content } = req.body;
        try {
            const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
            if (!updatedNote) {
                return res.status(404).json({ error: 'ノートが見つかりません' });
            }
            res.json(updatedNote);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // DELETEリクエスト（ノートの削除）
    else if (req.method === 'DELETE') {
        const { id } = req.query;
        try {
            await Note.findByIdAndDelete(id);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};

const mongoose = require('mongoose');

// ノートのスキーマを定義
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// モデルをエクスポート
module.exports = mongoose.model('Note', noteSchema);

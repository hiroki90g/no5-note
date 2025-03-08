// config/db.js
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI; // 環境変数を利用

if (!MONGO_URI) {
  throw new Error('MongoDBの接続URIが設定されていません。環境変数を確認してください。');
}

let isConnected = false; // 接続状態を管理

const connectDB = async () => {
  if (isConnected) {
    console.log('既にMongoDBに接続済み');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 接続の安定性向上（任意）
    });

    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDBに接続しました');
  } catch (err) {
    console.error('MongoDB接続エラー:', err);
    throw new Error('データベース接続に失敗しました');
  }
};

module.exports = connectDB;

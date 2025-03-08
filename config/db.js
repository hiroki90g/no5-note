// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlasの接続文字列
    const mongoURI = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<yourDatabaseName>?retryWrites=true&w=majority';

    // サーバーレス環境向けの接続設定
    if (mongoose.connection.readyState >= 1) {
      console.log('既にMongoDBに接続されています');
      return;
    }

    // MongoDBに接続
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDBに接続しました');
  } catch (err) {
    console.error('MongoDB接続エラー:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

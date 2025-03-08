// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://localhost:27017/yourDatabaseName'; // 必要に応じて変更

    await mongoose.connect(mongoURI);

    console.log('MongoDBに接続しました');
  } catch (err) {
    console.error('MongoDB接続エラー:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

require('dotenv').config();

const { JWT_SECRET = 'DEV_JWT_SECRET', MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

module.exports = {
  JWT_SECRET,
  MONGO_URL,
};

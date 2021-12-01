const rateLimiter = require('express-rate-limit');

const limit = rateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

module.exports = limit;

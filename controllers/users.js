const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IncorrectDataError = require('../errors/incorrect-data-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { JWT_SECRET } = require('../config');

module.exports.createUser = (req, res, next) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, name, password: hash }))
    .then(() => res.status(201).send({ email, name }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь с таким _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при обновлении профиля'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

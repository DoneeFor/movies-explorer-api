const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser, logout } = require('../controllers/users');
const errorMessages = require('../errors/errorMessages');
const NotFoundError = require('../errors/notFoundError');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value) => {
      if (validator.isEmail(value)) return value;
      throw new Error();
    }).messages(errorMessages.email),
    password: Joi.string().required().min(2).messages(errorMessages.password),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.rquired': 'Не указана почта',
        'string.empty': 'Поле "имя" не содержит информацию',
        'string.min': 'Имя должно содержать не менее {#limit} символов',
        'string.max': 'Имя должно содержать не более {#limit} символов',
      }),
  }),
}), createUser);

router.use(auth);

router.post('/signout', logout);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  res.status(404);
  res.send({ error: 'Not found' });
  return next(NotFoundError);
});

module.exports = router;

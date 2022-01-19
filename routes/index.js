const router = require('express').Router();
const userRoutes = require('./users');
const moviesRoutes = require('./movies');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserBody, validateAuthentication } = require('../middlewares/validations');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuthentication, login);
router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', moviesRoutes);

module.exports = router;

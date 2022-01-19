const router = require('express').Router();
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');
const { validateObjId, validateMovieBody } = require('../middlewares/validations');

router.get('/', getMovies);
router.post('/', validateMovieBody, addMovie);
router.delete('/:_id', validateObjId, deleteMovie);

module.exports = router;

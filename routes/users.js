const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/users');
const { validateProfileBody } = require('../middlewares/validations');

router.get('/me', getProfile);
router.patch('/me', validateProfileBody, updateProfile);

module.exports = router;

const router = require('express').Router();
const controller = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', protect, controller.me);
module.exports = router;

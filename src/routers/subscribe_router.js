const router = require('express').Router();
const authMiddleware = require('../middlewares/auth_middleware');
const subscribeController = require('../controllers/subscribe_controller');

router.get('/', authMiddleware.oturumAcilmis, subscribeController.subscribe);
router.post('/satinal', authMiddleware.oturumAcilmis, subscribeController.buy);

module.exports = router;
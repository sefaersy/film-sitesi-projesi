const router = require('express').Router();
const authMiddleware = require('../middlewares/auth_middleware');
const creditController = require('../controllers/credit_controller');

router.get('/', authMiddleware.oturumAcilmis, creditController.kredi);
router.post('/satinal', authMiddleware.oturumAcilmis, creditController.buy);
router.get('/toplamkredi', authMiddleware.oturumAcilmis, creditController.totalCredit);

module.exports = router;
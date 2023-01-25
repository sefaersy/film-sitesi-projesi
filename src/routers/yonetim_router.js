const router = require('express').Router();
const yonetimController = require('../controllers/yonetim_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const rentController = require('../controllers/rent_controller');
const purchasedController = require('../controllers/purchased_controller');
const searchController = require('../controllers/search_controller');


router.get('/', authMiddleware.oturumAcilmis, yonetimController.anaSayfayiGoster);
router.post('/kirala', authMiddleware.oturumAcilmis, rentController.rent);
router.get('/kiralanan', authMiddleware.oturumAcilmis, rentController.rentedFilm);
router.get('/alinan', authMiddleware.oturumAcilmis, purchasedController.purchaseFilm);
router.post('/satin-al', authMiddleware.oturumAcilmis, purchasedController.purchase);
router.get('/search', authMiddleware.oturumAcilmis, searchController.search);

module.exports= router;
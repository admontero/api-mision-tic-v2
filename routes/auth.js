const { Router } = require('express');
const router = Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//Devolver usuario autenticado
router.get('/', 
    auth,
    authController.userAuthenticated
);

router.post('/', 
    authController.googleLogin
);


module.exports = router;
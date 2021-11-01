const {Router} = require('express');
const router = Router();
const productController = require('../controllers/productController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// La ruta base sería api/productos

//Crear producto
router.post('/',
    auth,
    [
        check('_id', 'El identificador es obligatorio')
            .not()
            .isEmpty(),
        check('description', 'La descripción es requerida')
            .not()
            .isEmpty(),
        check('price')
            .not()
            .isEmpty()
            .withMessage('El precio es requerido')
            .isNumeric()
            .withMessage('El precio debe ser numérico'),
        check('status', 'Seleccionar el status del producto es obligatorio')
            .not()
            .isEmpty(),
    ],
    productController.create
);

//Ver productos
router.get('/', 
    auth,
    productController.read
);
//Ver productos filtrados por id
router.get('/?id', 
    auth,
    productController.read
);
//Ver productos filtrados por descripción
router.get('/?description', 
    auth,
    productController.read
);
//Ver un producto
router.get('/:id', 
    auth,
    productController.read
);

//Actualizar producto
router.patch('/:id',
    auth,
    [
        check('description', 'La descripción es requerida')
            .not()
            .isEmpty(),
        check('price')
            .not()
            .isEmpty()
            .withMessage('El precio es requerido')
            .isNumeric()
            .withMessage('El precio debe ser numérico'),
        check('status', 'Seleccionar el status del producto es obligatorio')
            .not()
            .isEmpty(),
    ],
    productController.update
);

module.exports = router;
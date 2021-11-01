const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// La ruta base sería api/ventas

//Crear venta
router.post('/',
    auth,
    [
        check('_id', 'El identificador es obligatorio')
            .not()
            .isEmpty(),
        check('date')
            .not()
            .isEmpty()
            .withMessage('La fecha es obligatoria')
            .isDate()
            .withMessage('La fecha debe ser válida'),
        check('client_id')
            .not()
            .isEmpty()
            .withMessage('El ID del cliente es obligatorio')
            .isNumeric()
            .withMessage('El ID solo tiene números permitidos'),
        check('client_name', 'El nombre del cliente es obligatorio')
            .not()
            .isEmpty(),
    ],
    purchaseController.create
);

//Ver ventas
router.get('/', 
    auth,
    purchaseController.read
);
//Ver ventas filtrados por id de venta
router.get('/?idVenta', 
    auth,
    purchaseController.read
);
//Ver ventas filtrados por id de cliente
router.get('/?idCliente', 
    auth,
    purchaseController.read
);
//Ver ventas filtrados por nombre de cliente
router.get('/?nameCliente', 
    auth,
    purchaseController.read
);
//Ver una venta
router.get('/:id', 
    auth, 
    purchaseController.read
);

//Actualizar venta
router.patch('/:id',
    auth,
    [
        check('date')
            .not()
            .isEmpty()
            .withMessage('La fecha es obligatoria')
            .isDate()
            .withMessage('La fecha debe ser válida'),
        check('client_id')
            .not()
            .isEmpty()
            .withMessage('El ID del cliente es obligatorio')
            .isNumeric()
            .withMessage('El ID solo tiene números permitidos'),
        check('client_name', 'El nombre del cliente es obligatorio')
            .not()
            .isEmpty(),
    ],
    purchaseController.update
);

module.exports = router;

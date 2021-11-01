const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// La ruta base sería api/usuarios

//Crear usuario
router.post('/',
    auth,
    [
        check('_id', 'El identificador es obligatorio')
            .not()
            .isEmpty(),
        check('name', 'El nombre es obligatorio')
            .not()
            .isEmpty(),
        check('email', 'La descripción es requerida')
            .not()
            .isEmpty()
    ],
    userController.create
);

//Ver usuarios
router.get('/', 
    auth,
    userController.read
);
//Ver un usuario
router.get('/:id', 
    auth,
    userController.read
);

//Actualizar usuario
router.patch('/:id',
    auth,
    [
        check('status', 'El estado del usuario es obligatorio')
            .not()
            .isEmpty(),
    ],
    userController.update
);

module.exports = router;
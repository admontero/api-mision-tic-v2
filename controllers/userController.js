const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.create = async (req, res) => {

    //Revisamos si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //Aplicamos destructuring al objeto
    const { _id } = req.body;

    //Validamos que el user_id sea único
    let userExists = await User.findOne({ _id });
    if (userExists) {
        return res.status(400).json({ msg: 'El ID del usuario debe ser único' });
    }
    
    try {
        //Instanciamos un nuevo user a partir del cuerpo de la petición
        //y que cumpla con lo que se estipula en el modelo User
        const user = new User(req.body);

        //Guardamos en la base de datos
        user.save();

        //Devolvemos la respuesta
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error desde el servidor');
    }
};

exports.read = async (req, res) => {
    const id = req.params.id;
    const filter = {};

    try {
        //Cuando se pase como parametro el id
        if (id) {
            filter._id = id;
            const result = await User.find(filter);
            return res.json(result);
        } else {
            const users = await User.find(filter);

            //Retorna todos los usuarios
            return res.send({
                status: 'OK',
                count: users.length,
                users: users 
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send('Error desde el servidor');
    }
};

exports.update = async (req, res) => {
    //Revisamos si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: 'Ingrese un id de usuario válido' });
    }
 
    try {        
        User.updateOne({ _id: id }, req.body, (error, result) => {
            if (error) {
                return res.status(500).send({ error });
            }

            User.find({ _id: id }, (error, result) => {
                if (error) {
                    return res.status(500).send({ error });
                }

                return res.send(result);
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error desde el servidor');
    }
};

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //Leer el token del header
    const token = req.header('x-auth-token');

    //Revisar si no hay token
    if (!token) {
        return res.status(401).send({ msg: 'No hay token, permiso no válido' });
    }

    //Validamos el token
    try {
        const passed = jwt.verify(token, process.env.JWT_SIGNIN_KEY);

        req._id = passed._id;
        next();
    } catch (error) {
        res.status(401).send({ msg: 'Token no válido' });
    }
};
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.NODE_API_GOOGLE_CLIENT_ID);

exports.googleLogin = (req, res) => {
    const { tokenId } = req.body;

    client.verifyIdToken({ idToken: tokenId, audience: process.env.NODE_API_GOOGLE_CLIENT_ID  })
        .then(response => {
            const { email_verified, sub, name, email, picture } = response.payload;
            if (email_verified) {
                User.findOne({ email }).exec((err, user) => {
                    if (err) {
                        return res.status(400).json({
                            error: "Algo va mal..."
                        });
                    } else {
                        if (user) {
                            const token = jwt.sign({_id: user._id}, process.env.JWT_SIGNIN_KEY, {expiresIn: '1d'});
                            const { _id, name, email, imageUrl, role, status } = user;

                            res.json({
                                token,
                                user: { _id, name, email, imageUrl, role, status }
                            });
                        } else {
                            let newUser = new User({ _id: sub, name, email, imageUrl: picture });
                            newUser.save((err, data) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: "Algo va mal..."
                                    });
                                }
                                const token = jwt.sign({_id: data._id}, process.env.JWT_SIGNIN_KEY, {expiresIn: '1d'});
                                const { _id, name, email, imageUrl, role, status } = newUser;

                                res.json({
                                    token,
                                    user: { _id, name, email, imageUrl, role, status }
                                });
                            });
                        }
                    }
                });
            }
        });
};

exports.userAuthenticated = async (req, res) => {
    try {
        const user = await User.findById(req._id);

        //Validar si está autorizado
        if (user.status === 'pendiente') {
            return res.status(401).send({ msg: 'Su usuario está pendiente de autorizar' });
        }

        if (user.status === 'no autorizado') {
            return res.status(401).send({ msg: 'Su usuario está desautorizado' });
        }

        if (user.role === '') {
            return res.status(401).send({ msg: 'Su usuario está sin permisos' });
        }
        
        res.json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};
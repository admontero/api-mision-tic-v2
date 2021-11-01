const Product = require('../models/Product');
const { validationResult } = require('express-validator');

exports.create = async (req, res) => {

    //Revisamos si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //Aplicamos destructuring al objeto
    const { _id, price } = req.body;

    //Validamos que el product_id sea único
    let productExists = await Product.findOne({ _id });
    if (productExists) {
        return res.status(400).json({ msg: 'El ID del producto debe ser único' });
    }

    if (price < 0) {
        return res.status(400).json({ msg: 'El precio del producto deben ser mayor o igual 0' });
    }
    
    try {
        //Instanciamos un nuevo producto a partir del cuerpo de la petición
        //y que cumpla con lo que se estipula en el modelo Product
        const product = new Product(req.body);

        //Guardamos en la base de datos
        product.save();

        //Devolvemos la respuesta
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error desde el servidor');
    }
};

exports.read = async (req, res) => {
    const idByParam = req.params.id;
    const id = req.query.id;
    const description = req.query.description;
    const filter = {};

    try {
        //Cuando se pase como parametro el id
        if (idByParam) {
            filter._id = idByParam;
            const result = await Product.find(filter);
            return res.json(result);
        } else {
            const products = await Product.find(filter);

            //Cuando el usuario busque por id
            if (id) {
                const productsFiltered = products.filter(product => product._id.toLowerCase().includes(id.toLowerCase()));
                return res.send({
                    status: 'OK',
                    count: productsFiltered.length,
                    products: productsFiltered
                });
            }
    
            //Cuando el usuario busque por descripción
            if (description) {
                const productsFiltered = products.filter(product => product.description.toLowerCase().includes(description.toLowerCase()));
                return res.send({
                    status: 'OK',
                    count: productsFiltered.length,
                    products: productsFiltered
                });
            }
    
            //Retorna todos los productos
            return res.send({
                status: 'OK',
                count: products.length,
                products: products 
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
        return res.status(400).send({ error: 'Ingrese un id de producto válido' });
    }
 
    try {        
        Product.updateOne({ _id: id }, req.body, (error, result) => {
            if (error) {
                return res.status(500).send({ error });
            }

            Product.find({ _id: id }, (error, result) => {
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
}

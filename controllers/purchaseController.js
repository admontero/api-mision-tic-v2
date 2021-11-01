const Purchase = require('../models/Purchase');
const { validationResult } = require('express-validator');

const removeAccents = (str) => {
return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 

exports.create = async (req, res) => {

    //Revisamos si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //Aplicamos destructuring al objeto
    const { _id } = req.body;

    //Validamos que el purchase_id sea único
    let purchaseExists = await Purchase.findOne({ _id });
    if (purchaseExists) {
        return res.status(400).json({ msg: 'El ID de la venta debe ser único' });
    }

    try {
        //Instanciamos una nueva venta a partir del cuerpo de la petición
        //y que cumpla con lo que se estipula en el modelo Venta
        const purchase = new Purchase(req.body);

        //Guardamos en la base de datos
        purchase.save();

        //Devolvemos la respuesta
        res.json(purchase);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};

exports.read = async (req, res) => {
    const idByParam = req.params.id;
    const idVenta = req.query.idVenta;
    const idCliente = req.query.idCliente;
    const nameCliente = req.query.nameCliente;
    const filter = {};

    try {
        //Cuando se pase como parametro el id
        if (idByParam) {
            filter._id = idByParam;
            const result = await Purchase.find(filter);
            return res.json(result);
        } else {
            const purchases = await Purchase.find(filter);

            //Cuando el usuario busque por id de venta
            if (idVenta) {
                const purchasesFiltered = purchases.filter(purchase => purchase._id.toLowerCase().includes(idVenta.toLowerCase()));
                return res.send({
                    status: 'OK',
                    count: purchasesFiltered.length,
                    purchases: purchasesFiltered
                });
            
            }
            //Cuando el usuario busque por id de cliente
            if (idCliente) {
                const purchasesFiltered = purchases.filter(purchase => purchase.client_id.toString().includes(idCliente));
                return res.send({
                    status: 'OK',
                    count: purchasesFiltered.length,
                    purchases: purchasesFiltered
                });
            }
    
            //Cuando el usuario busque por descripción
            if (nameCliente) {
                const purchasesFiltered = purchases.filter(purchase => removeAccents(purchase.client_name.toLowerCase()).includes(nameCliente.toLowerCase()));
                return res.send({
                    status: 'OK',
                    count: purchasesFiltered.length,
                    purchases: purchasesFiltered
                });
            }
    
            //Retorna todos los productos
            return res.send({
                status: 'OK',
                count: purchases.length,
                purchases: purchases 
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
        return res.status(400).send({ error: 'Ingrese un id de compra válido' });
    }
 
    try {        
        Purchase.updateOne({ _id: id }, req.body, (error, result) => {
            if (error) {
                return res.status(500).send({ error });
            }

            Purchase.find({ _id: id }, (error, result) => {
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
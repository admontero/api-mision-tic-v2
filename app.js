require('dotenv').config({ path: '.env' });
const chalk = require('chalk');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

app.use(cors());

//Conectamos la base de datos
connectDB();

app.use(express.json({ extended: true }));

//Puerto de la app
const PORT = process.env.PORT || 8080;

//Importamos rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/products'));
app.use('/api/usuarios', require('./routes/users'));
app.use('/api/ventas', require('./routes/purchases'));

//post, put, delete, patch
app.get('/', (req, res) => {
    res.send('Hola mundo desde endpoint');
});

/* app.get('/productos', (req, res) => {
    res.send('Aquí van todos los productos');
}); */

/* app.get('/usuarios', (req, res) => {
    res.send('Aquí van todos los usuarios');
}); */

/* app.get('/ventas', (req, res) => {
    res.send('Aquí van todas las ventas');
}); */

//Ruta con parámetros
/* app.get('/hola/:name', (req, res) => {
    const name = req.params.name;
    res.send(`Hola ${name}`);
}); */

//Toma cualquier ruta no definida
app.get('*', (req, res) => {
    res.status(404).send('404 | Página no encontrada');
});

app.listen(PORT, () => {
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
});
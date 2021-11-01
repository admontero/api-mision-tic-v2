const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const connectDB = async () => {
    try {
        //Aquí no se pone el string de conexion porque eso es privado
        //para ello creas un archivo .env en local donde pones
        //DB_MONGO=*string de conexión a tu base de datos de mongo*
        await mongoose.connect(process.env.DB_MONGO);
        console.log('Base de datos conectada');
    } catch (error) {
        console.log(error)
        process.exit(1); //Detener la app
    }
}

module.exports = connectDB;
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';

const app = express();
app.use(express.json()); //Para decirle que vaos a enviarle datos tipo JSON //conocidos como middleware
dotenv.config(); //conocidos como middleware
conectarDB()//conocidos como middleware

const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    console.log('hola 1');
    console.log(dominiosPermitidos);
    console.log(origin);    
    console.log(dominiosPermitidos.indexOf(origin));
    
    if(dominiosPermitidos.indexOf(origin) !== -1 ){
        console.log('hola 2');
        //El origen del request esta permitido  
        callback(null, true); //null es el error
    } else {
        console.log('hola 3');
        callback(new Error('No permitido por CORS_'));  //null es el error
    }
  },
};
app.use(cors(corsOptions));
console.log(process.env.MONGO_URI);
//app.use('/', (req, res) =>{
//    res.send('Hola Mundo');
//})

app.use('/api/veterinarios', veterinarioRoutes) //use es get, post, put, etc //conocidos como middleware
app.use('/api/pacientes', pacienteRoutes) //use es get, post, put, etc //conocidos como middleware

const PORT = process.env.PORT || 4000; // si no existe aplica el puerto 4000 - para el deployment
app.listen(PORT, () =>{
    console.log(`Servidor funcionando... en puerto ${PORT}`)
});
console.log('Desde Node JS');

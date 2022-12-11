import jwt from 'jsonwebtoken'
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {
    //console.log("Desde mi Middleware");
    console.log(req.headers);
    console.log("Token con Encabezado (Bearer) - " + req.headers.authorization);
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer") ){
        console.log("SI Hay token o Bearer");
        try {
            token = req.headers.authorization.split(' ')[1];  //console.log(req.headers.authorization); //console.log("Token sin Encabezado (Bearer) - " + token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log("Información Decodificada - " + decoded); //console.log("Información Decodificada - " + decoded.id);
            //req.veterinario = await Veterinario.findById(decoded.id); //const veterinario = await Veterinario.findById(decoded.id).select('-password -token - confirmado');
            //Crea una sesión con la inf de veterinario
            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');
            // hace la validacion en el servidor
            //console.log("inf de veterinario 2");
            //console.log("Información veterinario - " + req.veterinario);
            return next();
        } catch (error) {
            const e = new Error("Token NO Valido");
            return res.status(403).json({ msg: e.message });
        }
    } 
    if(!token){
        const error = new Error("Token NO Valido o Inexistente");
        return res.status(403).json({ msg: error.message });
    }

    next();
};

export default checkAuth;
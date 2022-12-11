import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    //res.send("Desde API/VETERINARIOS") //res.send({ url: "Desde API/VETERINARIOS" }) //res.json({ url: "Desde API/VETERINARIOS" })
    //console.log(req.body); //const { nombre, email, password } = req.body; //console.log(nombre); //console.log(email); //console.log(password); 
    const { email, nombre } = req.body;
    //Prevenir Usuarios Duplicados
    const existeUsuario = await Veterinario.findOne({ email });
    if(existeUsuario){
        const error = new Error("Usuario Ya Registrado - Backend");
        return res.status(400).json({ msg:error.message });
        //console.log('Usuario existente');
    }
    try{
        //Guardar un nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save(); //Espere mientras guarda

        // Enviar el Email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token,
        });

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error)
    }
    //res.json({ msg: "Usuario ha sido Registrado..." }); //res.json({ msg: "Registrando usuarios..." })
};

const perfil = (req, res) => {
    //res.send("Desde API/VETERINARIOS/perfil") //res.send({ url: "Desde API/VETERINARIOS/perfil" }) //res.json({ url: "Desde API/VETERINARIOS/perfil" })
    //console.log(req.veterinario);
    const { veterinario } = req;
    
    //res.json({ msg: "Mostrando perfil..." });
    //res.json({ perfil: veterinario }); // igula a: res.json({ veterinario }) //console.log('Perfil 1'); 
    //res.json({ perfil: veterinario }); SE REEMPLAZÓ PARA corregir el error con:
    res.json(veterinario);
    console.log(veterinario); //console.log('Perfil 2');
};
const confirmar = async (req, res) => {
    //console.log(req.params.tok);
    const { token } = req.params

    const usuarioConfirmar = await Veterinario.findOne({ token });

    if(!usuarioConfirmar){
        const error = new Error("Token NO Valido");
        return res.status(404).json({ msg: error.message });
    }

    try{
        usuarioConfirmar.token = null; //Esta es la variable Token de la BD de JSON
        usuarioConfirmar.confirmado = true; //Esta es la variable confirmado de la BD de JSON
        await usuarioConfirmar.save();

        res.json({ msg: "Usuario confirmado correctamente..." });
    } catch(error) {
        console.log(error)
    }
    //console.log(usuarioConfirmar);
    //res.send("Desde API/VETERINARIOS/perfil") //res.send({ url: "Desde API/VETERINARIOS/perfil" }) //res.json({ url: "Desde API/VETERINARIOS/perfil" })
  
};

const autenticar = async (req, res) => {
    //console.log(req.body);
     const { email, password } = req.body;
    
     //Comprobar si el usuario Existe
    const usuario = await Veterinario.findOne({ email });
    console.log(usuario);
    if(!usuario){
        const error = new Error("El Usuario No Existe");
        return res.status(404).json({ msg: error.message });
        //console.log('Usuario existente'); //res.json({ msg:"Autenticando..."}); //} else { //    res.status(403).json({ msg:"Usuario NO Existe"})
    }
    //Comprobar si el usuario está confirmado
    if(!usuario.confirmado){
        const error = new Error("Tu Cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message });
    }
    //Revisar el Password - Autenticar el usuario
    if (await usuario.comprobarPassword(password)){
        //Autenticar el usuario
        //console.log('Pasword correcto');
        //res.json({token: generarJWT(usuario.id)}) SE REEMPLAZÓ PARA corregir el error con:
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        });

    } else {
        const error = new Error("El Password es Incorrecto");
        return res.status(403).json({ msg: error.message });
    }
};

const olvidePassword = async (req, res) =>{
    const { email } = req.body;
    console.log(email);
    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario) {
        const error = new Error("El Usuario NO Existe");
        return res.status(400).json({ msg: error.message });
    }
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        
        // Enviar Email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        });
        res.json({msg: "Hemos enviado un email con las instrucciones"});
    } catch (error) {
        console.log(error);
    }
}
const comprobarToken = async (req, res) =>{
    const { token } = req.params;
    //console.log(token);
    const tokenValido = await Veterinario.findOne({ token });
    if(tokenValido){
        console.log('token valido y el Usuario Existe');
        res.json({msg: "Token valido y el Usuario Existe"});
    } else {
        const error = new Error("Token NO valido");
        return res.status(400).json({ msg: error.message });
    }
}
const nuevoPassword = async (req, res) =>{
    const { token } = req.params;
    const { password } = req.body;
    const veterinario = await Veterinario.findOne({ token });
    if(!veterinario){
        const error = new Error("Hubo un Error");
        return res.status(400).json({ msg: error.message });
    }
    try {
        //console.log(veterinario);
        veterinario.token = null;
        veterinario.password = password;
        veterinario.save();
        res.json({msg: "Password Modificado correctamente"});
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res ) => {
    //console.log(req.params.id)
    //console.log(req.body)
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new error('Hubo un error');
        return res.status(400).json({ msg: error.message});
    }

    const {email} = req.body
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email})
        if(existeEmail){
            const error = new Error('Email esta en uso');
            return res.status(400).json({ msg: error.message});
        }
    }
    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre;
        veterinario.email = req.body.email || veterinario.email;
        veterinario.web = req.body.web || veterinario.web;
        veterinario.telefono = req.body.telefono || veterinario.telefono;
        
        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }

} 

const actualizarPassword = async (req, res) => { 
    console.log('actualizando...1')
    //console.log(req.veterinario)
    //console.log(req.body)
    //Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;
    // comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error("Hubo un Error");
        return res.status(400).json({ msg: error.message });
    }

    // comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
        // Almacenar el nuevo password
        console.log('correcto')
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: "Password Modificado correctamente"});

    } else {
        console.log(pwd_actual.length)
        const error = new Error("El password Actual es Incorrecto");
        return res.status(400).json({ msg: error.message });
    }
    
    console.log('actualizando')
}
export {
    registrar, 
    perfil, 
    confirmar, 
    autenticar, 
    olvidePassword, 
    comprobarToken, 
    nuevoPassword, 
    actualizarPerfil,
    actualizarPassword,
};
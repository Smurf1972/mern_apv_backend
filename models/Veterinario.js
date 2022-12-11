import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import generarId from '../helpers/generarId.js';

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true 
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
        trim: true
    },
    token: {
        type: String,
        default: generarId(),
    },
    confirmado: {
        type: Boolean,
        default: false,
        trim: true
    }
});

veterinarioSchema.pre('save', async function (next) {
    //console.log('Antes de almacenar');
    console.log(this);
    if(!this.isModified('password')){ // Para que el password ya está hasheado no se vuelva a hashear
        next(); //conocidos como middleware

    }
    const salt = await bcrypt.genSalt(10); //Numero de rondas de Hasheo
    this.password = await bcrypt.hash(this.password, salt);
});

veterinarioSchema.methods.comprobarPassword = async function(
    passwordFormulario
){
    return await bcrypt.compare(passwordFormulario, this.password);
};

//El nombre que se coloca aquí es el que se utiliza para relacionarlo en otros schemas
const Veterinario = mongoose.model('Veterinario', veterinarioSchema); //de esta forma queda registrado como modelo que debe de interatuarcon la BD
export default Veterinario;
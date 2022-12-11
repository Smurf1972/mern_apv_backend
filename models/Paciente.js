import mongoose from 'mongoose';

const pacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    propietario: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    sintomas: {
        type: String,
        required: true
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario',
    },
    confirmado: {
        type: Boolean,
        default: false,
        trim: true
    },
}, 
{
    timestamps: true,
}
);

const Paciente = mongoose.model("Paciente", pacientesSchema); //de esta forma queda registrado como modelo que debe de interatuarcon la BD
export default Paciente;
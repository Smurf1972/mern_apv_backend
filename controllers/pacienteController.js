import Paciente from "../models/Paciente.js";
const agregarPaciente = async ( req, res) =>{   //console.log(req.body);
    const paciente = new Paciente(req.body);    //console.log(paciente);
    paciente.veterinario = req.veterinario._id; 
    try { //console.log(req.veterinario); //console.log(req.veterinario._id); // ya extrajo el veterinario que esta relacionado en paciente desde //authMiddleware.js -> ckeckAuth -> req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');
        //console.log(paciente);
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
}
const obtenerPacientes = async ( req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
    res.json(pacientes); 
}
const consultarPaciente = async ( req, res) => {
    //console.log('obtenerPaciente');
    //console.log(req.params.id);
    //console.log('obtenerPaciente');
    const { id } = req.params;
    const paciente = await Paciente.findById(id);
    console.log(paciente); 
    console.log(paciente.veterinario._id);
    console.log(req.veterinario._id);
    if(!paciente){ 
        res.status(404).json({msg: 'No encontrado'});
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ //.toString asegura la comparación
        return res.json({ msg: 'Acción NO Valida' }); 
    }
    return res.json(paciente); 
}
const actualizarPaciente = async ( req, res) =>{
    const { id } = req.params;
    const paciente = await Paciente.findById(id);
    console.log("1");
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ //.toString asegura la comparación
        return res.json({ msg: 'Acción NO Valida' }); 
    }
    //Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre; // || o el mismo nombre
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
};
const eliminarPaciente = async ( req, res) =>{
    const { id } = req.params;
    const paciente = await Paciente.findById(id);
    if(!paciente){ 
        res.status(404).json({msg: 'No encontrado'});
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ //.toString asegura la comparación
        return res.json({ msg: 'Acción NO Valida' }); 
    }
    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente Eliminado'});
    } catch (error) {
        console.log(error);
    }
}
export { agregarPaciente, obtenerPacientes, consultarPaciente, actualizarPaciente, eliminarPaciente, }
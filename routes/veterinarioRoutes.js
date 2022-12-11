import express from 'express';
import { registrar, 
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword, 
} from '../controllers/veterinarioController.js'
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

//Rutas Publicas
router.post('/', registrar); //Al ser formulario, debe ser para enviar POST
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
//router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword); // Igual a:
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);
//Rutas Privadas
router.get('/perfil',checkAuth, perfil);
//router.get('/pacientes',checkAuth);
router.put('/perfil/:id',checkAuth, actualizarPerfil);
router.put('/actualizar-password',checkAuth, actualizarPassword);

//router.get('/perfil', (req, res) => {
//    res.send("Desde API/VETERINARIOS/perfil")
//});
//router.get('/login', (req, res) => {
//    res.send("Desde API/VETERINARIOS/LOGIN")
//})
export default router; //NO tiene q llamarse igual
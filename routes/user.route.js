import express from 'express';
import usuarioController from '../controllers/usuario.controller.js'
import { isDirector, requireToken } from '../middleware/validateSesion.js';

const usuarioRoute = express.Router();

usuarioRoute.post('/login', usuarioController.login)
usuarioRoute.get('/verifysesion', requireToken, usuarioController.verificarsesion)
usuarioRoute.put('/changepassword', requireToken ,usuarioController.updatePassword)
usuarioRoute.post('/tokenrecuperacion/:email', usuarioController.generarTokenRecuperacion)
usuarioRoute.get('/tokenverify/:token', usuarioController.verifyToken)
usuarioRoute.post('/rol/:docente', requireToken, isDirector, usuarioController.cambiarRol)
usuarioRoute.post('/recuperarpassword/:token', usuarioController.recuperarPassword)
usuarioRoute.patch('/estado/:docente', requireToken, isDirector,usuarioController.cambiarEstado)

export default usuarioRoute
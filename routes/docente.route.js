import express from 'express';
import docenteController from '../controllers/docente.controller.js';
import { isDirector, requireToken } from '../middleware/validateSesion.js';

const docenteRoute = express.Router();


docenteRoute.post('/', requireToken, isDirector, docenteController.crear)
docenteRoute.get('/', requireToken, isDirector, docenteController.obtenerTodos)
docenteRoute.get('/one', requireToken, docenteController.obtenerUno)
//docenteRoute.delete('/:id', requireToken, isDirector, docenteController.eliminar)
docenteRoute.patch('/:id', requireToken, isDirector, docenteController.editar)
docenteRoute.patch('/dedicacion/:id', requireToken, docenteController.editarDedicacion)

export default docenteRoute
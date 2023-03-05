import express from 'express';
import docenteController from '../controllers/docente.controller.js';
import { isDirector, requireToken } from '../middleware/validateSesion.js';

const docenteRoute = express.Router();

docenteRoute.get('/', requireToken, isDirector, docenteController.obtenerTodos)
docenteRoute.get('/one', requireToken, docenteController.obtener)
docenteRoute.post('/', requireToken, isDirector, docenteController.guardar)
docenteRoute.delete('/:id', requireToken, isDirector, docenteController.eliminar)
docenteRoute.patch('/:id', requireToken, isDirector, docenteController.editar)

export default docenteRoute
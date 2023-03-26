import express from 'express'
import actividadDesarrolladaController from '../controllers/actividadDesarrollada.controller.js';
import { requireToken } from '../middleware/validateSesion.js';

const actividadDesarrolladaRouter = express.Router();

actividadDesarrolladaRouter.get('/:especifica', requireToken, actividadDesarrolladaController.obtenerPorActividadEspecifica)
actividadDesarrolladaRouter.post('/', requireToken, actividadDesarrolladaController.guardar)
actividadDesarrolladaRouter.delete('/:id', requireToken, actividadDesarrolladaController.eliminar)
actividadDesarrolladaRouter.put('/:id', requireToken, actividadDesarrolladaController.editar)

export default actividadDesarrolladaRouter
import express from 'express';
import evidenciaController from '../controllers/evidencia.controller.js';
import { requireToken } from '../middleware/validateSesion.js';

const evidenciaRouter = express.Router()

evidenciaRouter.get('/:especifica', requireToken, evidenciaController.obtenerPorActividadEspecifica)
evidenciaRouter.post('/', requireToken, evidenciaController.guardar)
evidenciaRouter.delete('/:id', requireToken, evidenciaController.eliminar)
evidenciaRouter.put('/:id', requireToken, evidenciaController.editar)

export default evidenciaRouter
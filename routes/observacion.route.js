import express from 'express'
import observacionController from '../controllers/observacion.controller.js'
import { requireToken } from '../middleware/validateSesion.js';

const observacionRouter = express.Router()

observacionRouter.get('/:especifica', requireToken ,observacionController.obtenerPorActividadEspecifica)
observacionRouter.post('/', requireToken, observacionController.guardar)
observacionRouter.delete('/:id', requireToken, observacionController.eliminar) 
observacionRouter.put('/:id', requireToken, observacionController.editar)

export default observacionRouter
import express from 'express';
import conclusionRecomendacionController from '../controllers/conclusionRecomendacion.controller.js'
import { requireToken } from '../middleware/validateSesion.js';

const conclusionRouter = express.Router()

conclusionRouter.get('/:informe', requireToken, conclusionRecomendacionController.obtenerPorInforme)
conclusionRouter.post('/', requireToken, conclusionRecomendacionController.guardar)
conclusionRouter.delete('/:id', requireToken, conclusionRecomendacionController.eliminar)
conclusionRouter.put('/:id', requireToken, conclusionRecomendacionController.editar)

export default conclusionRouter
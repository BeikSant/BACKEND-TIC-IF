import express from 'express';
import informeFinalController from '../controllers/informeFinal.controller.js';
import { requireToken } from '../middleware/validateSesion.js';

const informeFinalRouter = express.Router()

informeFinalRouter.get('/', requireToken, informeFinalController.obtenerTodosPorDocente)
informeFinalRouter.post('/:informe/:formato', requireToken, informeFinalController.asignarFormato)
informeFinalRouter.get('/:periodo', requireToken, informeFinalController.obtenerPorPeriodo)

export default informeFinalRouter
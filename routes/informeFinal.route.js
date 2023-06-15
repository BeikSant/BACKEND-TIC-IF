import express from 'express';
import informeFinalController from '../controllers/informeFinal.controller.js';
import { isDirector, requireToken } from '../middleware/validateSesion.js';
import upload from '../utils/upload-files.js'

const informeFinalRouter = express.Router()

informeFinalRouter.get('/', requireToken, informeFinalController.obtenerTodosPorDocente)
informeFinalRouter.get('/all/:periodo', requireToken, isDirector, informeFinalController.obtenerTodosPorPeriodo)
informeFinalRouter.get('/:periodo', requireToken, informeFinalController.obtenerPorPeriodo)
informeFinalRouter.post('/upload', requireToken, upload, informeFinalController.guardarInformeFirmaDocente)
informeFinalRouter.post('/estado/:informe', requireToken, informeFinalController.cambiarEstado)
informeFinalRouter.post('/:informe/:formato', requireToken, informeFinalController.asignarFormato)

export default informeFinalRouter
import express from 'express'
import notificacionController from '../controllers/notificacion.controller.js'
import { requireToken } from '../middleware/validateSesion.js'

const notificacionRouter = express.Router()

notificacionRouter.post('', requireToken, notificacionController.guardarNotificacion)
notificacionRouter.get('', requireToken, notificacionController.obtenerTodasPorDocente)
notificacionRouter.get('/noleidos', requireToken, notificacionController.obtenerNoLeidos)
notificacionRouter.put('/:id', requireToken, notificacionController.leeNotificacion)

export default notificacionRouter
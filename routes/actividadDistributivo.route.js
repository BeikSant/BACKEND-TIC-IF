import express from 'express'
import actividadDistributivoController from '../controllers/actividadDistributivo.controller.js';
import { isDirector, requireToken } from '../middleware/validateSesion.js';

const actividadDistributivoRoute = express.Router();

actividadDistributivoRoute.get('/', requireToken, actividadDistributivoController.obtenerTodos)
actividadDistributivoRoute.post('/', requireToken, isDirector ,actividadDistributivoController.guardarTodos)
actividadDistributivoRoute.post('/one', requireToken, isDirector, actividadDistributivoController.guardarUno)
actividadDistributivoRoute.get('/:id', requireToken, actividadDistributivoController.obtenerPorFuncion)


export default actividadDistributivoRoute;

import express from 'express'
import actividadDistributivoController from '../controllers/actividadDistributivo.controller.js';
import { isDirector, requireToken } from '../middleware/validateSesion.js';

const actividadDistributivoRoute = express.Router();

actividadDistributivoRoute.get('/', requireToken, actividadDistributivoController.obtenerActivas)
actividadDistributivoRoute.post('/', requireToken, isDirector ,actividadDistributivoController.guardarTodos)


export default actividadDistributivoRoute;

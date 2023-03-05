import express from 'express';
import carreraController from '../controllers/carrera.controller.js';
import { isDirector, requireToken } from '../middleware/validateSesion.js';

const carreraRouter = express.Router();

carreraRouter.get('/', requireToken, carreraController.obtenerTodos)

export default carreraRouter
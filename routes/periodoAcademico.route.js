import express from 'express';
import periodoAcademicoController from '../controllers/periodoAcademico.controller.js';
import { isDirector, requireToken } from '../middleware/validateSesion.js';

const periodoAcademicoRouter = express.Router();

periodoAcademicoRouter.get('/', requireToken, isDirector, periodoAcademicoController.obtenerTodos)
periodoAcademicoRouter.post('/', requireToken, isDirector, periodoAcademicoController.crear)
periodoAcademicoRouter.get('/activo', requireToken, periodoAcademicoController.obtenerActivo)
periodoAcademicoRouter.delete('/:id', requireToken, isDirector, periodoAcademicoController.eliminar)


export default periodoAcademicoRouter
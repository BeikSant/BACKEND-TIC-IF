import express from 'express';
import formatoController from '../controllers/formato.controller.js';
import { isDirector, requireToken } from '../middleware/validateSesion.js';

const formatoRouter = express.Router();

formatoRouter.get('/', requireToken,isDirector, formatoController.obtenerTodos);
formatoRouter.post('/', requireToken, isDirector, formatoController.crear);
formatoRouter.patch('/:id', requireToken, isDirector, formatoController.actualizar)

formatoRouter.get('/defecto', requireToken, isDirector, formatoController.obtenerPorDefecto)
formatoRouter.patch('/estado/:id', requireToken, isDirector, formatoController.cambiarEstado);
formatoRouter.get('/active', requireToken, formatoController.obtenerActivo)
formatoRouter.get('/:formato', requireToken, formatoController.obtenerUno)

formatoRouter.delete('/:id', requireToken, isDirector, formatoController.eliminar)

export default formatoRouter
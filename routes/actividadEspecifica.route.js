import express from 'express';
import actividadEspecificaController from '../controllers/actividadEspecifica.controller.js';
import { requireToken } from '../middleware/validateSesion.js';

const actividadEspecificaRouter = express.Router();

actividadEspecificaRouter.get('/:informe/:idFuncionSustantiva', requireToken, actividadEspecificaController.obtenerPorInforme)
actividadEspecificaRouter.post('/:informe/:distributivo', requireToken, actividadEspecificaController.guardar)
actividadEspecificaRouter.delete('/:especifica', requireToken, actividadEspecificaController.eliminar)
actividadEspecificaRouter.patch('/:id', requireToken, actividadEspecificaController.actualizar)

export default actividadEspecificaRouter
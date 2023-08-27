import express from "express";
import actividadDesarrolladaRouter from "./actividadDesarrollada.route.js";
import actividadDistributivoRoute from "./actividadDistributivo.route.js";
import actividadEspecificaRouter from "./actividadEspecifica.route.js";
import carreraRouter from "./carrera.route.js";
import conclusionRouter from "./conclusionesRecomendacion.route.js";
import docenteRoute from "./docente.route.js";
import evidenciaRouter from "./evidencia.route.js";
import formatoRouter from "./formato.route.js";
import informeFinalRouter from "./informeFinal.route.js";
import notificacionRouter from "./notificacion.route.js";
import observacionRouter from "./observacion.route.js";
import periodoAcademicoRouter from "./periodoAcademico.route.js";
import usuarioRoute from "./user.route.js";

const router = express.Router();

const rutaPrincipal = "/api/v1/"; //Es la ruta principal para el consumo de la APIS
//Aqui se colocan todas las rutas que tendra la API
router.use(rutaPrincipal + "user/", usuarioRoute);
router.use(rutaPrincipal + "docente/", docenteRoute);
router.use(rutaPrincipal + "distributivo/", actividadDistributivoRoute);
router.use(rutaPrincipal + "formato/", formatoRouter);
router.use(rutaPrincipal + "periodo/", periodoAcademicoRouter);
router.use(rutaPrincipal + "especifica/", actividadEspecificaRouter);
router.use(rutaPrincipal + "informe/", informeFinalRouter);
router.use(rutaPrincipal + "evidencia/", evidenciaRouter);
router.use(rutaPrincipal + "desarrollada/", actividadDesarrolladaRouter);
router.use(rutaPrincipal + "observacion/", observacionRouter);
router.use(rutaPrincipal + "carrera/", carreraRouter);
router.use(rutaPrincipal + "conclusionrecomendacion/", conclusionRouter);
router.use(rutaPrincipal + "notificacion/", notificacionRouter);

export default router ;

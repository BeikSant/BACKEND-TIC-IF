import express from 'express';
import 'dotenv/config';
import './database/configdb.js';
import 'express-async-errors';
import usuarioRoute from './routes/user.route.js';
import docenteRoute from './routes/docente.route.js';
import actividadDistributivoRoute from './routes/actividadDistributivo.route.js';
import formatoRouter from './routes/formato.route.js';
import periodoAcademicoRouter from './routes/periodoAcademico.route.js';
import actividadEspecificaRouter from './routes/actividadEspecifica.route.js';
import informeFinalRouter from './routes/informeFinal.route.js';
import evidenciaRouter from './routes/evidencia.route.js';
import actividadDesarrolladaRouter from './routes/actividadDesarrollada.route.js';
import observacionRouter from './routes/observacion.route.js';
import carreraRouter from './routes/carrera.route.js';
import notificacionRouter from './routes/notificacion.route.js';
import conclusionRouter from './routes/conclusionesRecomendacion.route.js';
import cors from 'cors'
import morgan from 'morgan';
import http from 'http';
import initialize from './database/initialize.js';
import socket from './utils/socket.js';
import multer from 'multer';
import corsConfg from './utils/cors.js';

const app = express() //inicializa el proyecto con express.js
app.disable("x-powered-by") // Desactiva la informacion de las herramientas que se usaron en el servidor

//Inicializacion de socket.io
const server = http.createServer(app);
socket(server)

await initialize.initData() //inicializa algunos datos, cuando no hayan nada en la base de datos

// Configuacion de cors
app.use(cors(corsConfg))

app.use(express.static('public'))  //Sirve hacer publico el arcivos public
app.use(express.json()); //Sirve para leer las archivos json
app.use(morgan('tiny')) //Se inicializa morgan en el proyecto, para leer todas la peticiones al servidor

const rutaPrincipal = "/api/v1/" //Es la ruta principal para el consumo de la APIS
//Aqui se colocan todas las rutas que tendra la API
app.use(rutaPrincipal + "user/", usuarioRoute);
app.use(rutaPrincipal + "docente/", docenteRoute);
app.use(rutaPrincipal + "distributivo/", actividadDistributivoRoute);
app.use(rutaPrincipal + "formato/", formatoRouter);
app.use(rutaPrincipal + "periodo/", periodoAcademicoRouter);
app.use(rutaPrincipal + "especifica/", actividadEspecificaRouter);
app.use(rutaPrincipal + "informe/", informeFinalRouter);
app.use(rutaPrincipal + "evidencia/", evidenciaRouter);
app.use(rutaPrincipal + "desarrollada/", actividadDesarrolladaRouter);
app.use(rutaPrincipal + "observacion/", observacionRouter);
app.use(rutaPrincipal + "carrera/", carreraRouter);
app.use(rutaPrincipal + "conclusionrecomendacion/", conclusionRouter)
app.use(rutaPrincipal + "notificacion/", notificacionRouter)

//Manejo de excepciones no controladas
app.use((err, _req, res, _next) => {
    console.log(err);
    console.log(err instanceof multer.MulterError)
    if (err instanceof multer.MulterError) return res.status(400).send({ error: 'Error al cargar el archivo: ' + err.message });
    return res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 8000; // Aqui se coloca el puerto de la aplicacion
server.listen(PORT, (err, _res) => { //Aqui se inicia el servidor
    if (err) return console.log(err);
    console.log('Servidor iniciado con éxito en puerto:', PORT)
});

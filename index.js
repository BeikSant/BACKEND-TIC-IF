import express from 'express';
import 'dotenv/config';
import './database/db.js';
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
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import conclusionRouter from './routes/conclusionesRecomendacion.route.js';
import init from './utils/init.js';

const app = express();
var whitelist = [process.env.ORIGIN_1, process.env.ORIGIN_2, process.env.ORIGIN_3 ? process.env.ORIGIN_3 : '' ]

await init.initData()

//app.use(cors())

app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

app.use(express.json()); //Sirve para leer las archivos json
app.use(cookieParser());

const rutaPrincipal = "/api/v1/"

app.use(morgan('tiny'))

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

//Manejo de excepciones no controladas
app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, (err, res) => {
    if (err) return console.log(err);
    console.log('Servidor corriendo ', PORT)
});
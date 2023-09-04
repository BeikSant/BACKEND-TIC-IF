import express from "express";
import "dotenv/config";
import "./database/configdb.js";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import socket from "./utils/socket.js";
import multer from "multer";
import corsConfg from "./utils/cors.js";
import router from "./routes/index.js";
import { engine } from "express-handlebars";

const app = express(); //inicializa el proyecto con express.js
app.disable("x-powered-by"); // Desactiva la informacion de las herramientas que se usaron en el servidor

//Inicializacion de socket.io
const server = http.createServer(app);
socket(server);

app.use(cors(corsConfg));// Configuacion de cors
app.use(express.static("public")); //Sirve hacer publico el arcivos public
app.use(express.json()); //Sirve para leer las archivos json
app.use(morgan("tiny")); //Se inicializa morgan en el proyecto, para leer todas la peticiones al servidor

app.use(router); //Manejo de las rutas

//Manejo de excepciones no controladas
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err instanceof multer.MulterError)
    return res
      .status(400)
      .send({ error: "Error al cargar el archivo: " + err.message });
  return res.status(500).json({ message: "Error interno del servidor" });
});

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "templates/"
  })
);

const PORT = process.env.PORT || 8000;
//AQUI SI INICIA EL SERVIDOR
server.listen(PORT, (err, _res) => {
  if (err) return console.log(err);
  console.info("Servidor iniciado con éxito en puerto:", PORT);
});

export { app, server };

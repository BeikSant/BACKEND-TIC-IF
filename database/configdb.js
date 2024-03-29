import mongoose from "mongoose";
import initialize from "./initialize.js";

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.URI_MONGO)
  .then(async () => {
    console.info("Se ha establecido la conexión con la base de datos");
    //inicializa algunos datos, cuando no hayan nada en la base de datosD
    if (process.env.MODO != "test") await initialize.initData();
  })
  .catch((error) => {
    console.error("Error en la conexión a la base de datos: " + error);
  });

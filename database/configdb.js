import mongoose from "mongoose";
import initialize from "./initialize.js";

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.URI_MONGO)
  .then(() => {
    //console.log("Se ha establecido la conexion con la base de datos");
    if (process.env.MODO != "test") {
      initialize.initData(); //inicializa algunos datos, cuando no hayan nada en la base de datos
    }
  })
  .catch(() => {
    console.log("Error en la conexión a la base de datos: " + error);
  });

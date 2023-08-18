import mongoose from "mongoose";
import initialize from "./initialize.js";

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.URI_MONGO)
  .then(() => {
    //("Se ha establecido la conexion con la base de datos");
    if (process.env.MODO != "test") {
      initialize.initData(); //inicializa algunos datos, cuando no hayan nada en la base de datos
    }
  })
  .catch(() => {
    ("Error en la conexión a la base de datos: " + error);
  });

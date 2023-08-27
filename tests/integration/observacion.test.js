import { token } from "../config/config.test";
import supertest from "supertest";
import { app } from "../../index";

const api = supertest(app);

describe("Pruebas API observaciones", () => {
  test("Agregar una observacion", async () => {
    await api
      .post("/api/v1/observacion")
      .set("Authorization", `bearer ${token}`)
      .send({
        observacion: {
          nombre: "Observacion",
          actividadEspecifica: "63e4a32e0f8f740d3dbf034e",
        },
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  let observaciones = [];

  test("Obtener todas las observaciones de una actividad especifica", async () => {
    await api
      .get("/api/v1/observacion/63e4a32e0f8f740d3dbf034e")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .then((res) => {
        observaciones = res.body.observaciones;
      });
  });

  test("Editar una observacion", async () => {
    await api
      .put(
        "/api/v1/observacion/" +
          observaciones[observaciones.length - 1]._id
      )
      .set("Authorization", `bearer ${token}`)
      .send({
        observacion: {
          nombre: "Observacion update",
        },
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Eliminar una observacion", async () => {
    await api
      .delete(
        "/api/v1/observacion/" +
          observaciones[observaciones.length - 1]._id
      )
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

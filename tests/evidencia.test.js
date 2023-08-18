import { token } from "./config/config.test";
import supertest from "supertest";
import { app } from "../index";

const api = supertest(app);

describe("Pruebas API evidencias", () => {
  test("Agregar una evidencia", async () => {
    await api
      .post("/api/v1/evidencia")
      .set("Authorization", `bearer ${token}`)
      .send({
        evidencia: {
          nombre: "Evidencia",
          actividadEspecifica: "63e4a32e0f8f740d3dbf034e",
        },
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  let evidencias = [];

  test("Obtener todas las evidencias de una actividad especifica", async () => {
    await api
      .get("/api/v1/evidencia/63e4a32e0f8f740d3dbf034e")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .then((res) => {
        evidencias = res.body.evidencias;
        console.log(evidencias)
      });
  });

  test("Editar una evidencia", async () => {
    await api
      .put(
        "/api/v1/evidencia/" +
          evidencias[evidencias.length - 1]._id
      )
      .set("Authorization", `bearer ${token}`)
      .send({
        evidencia: {
          nombre: "Evidencia update",
        },
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Eliminar una evidencia", async () => {
    await api
      .delete(
        "/api/v1/evidencia/" +
          evidencias[evidencias.length - 1]._id
      )
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

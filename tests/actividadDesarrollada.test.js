import { token } from "./config/config.test";
import supertest from "supertest";
import { app } from "../index";

const api = supertest(app);

describe("Pruebas API actividad desarrollada", () => {
  test("Agregar una actividad desarrollada", async () => {
    await api
      .post("/api/v1/desarrollada")
      .set("Authorization", `bearer ${token}`)
      .send({
        actividadDesarrollada: {
          nombre: "Actividad desarrollada",
          actividadEspecifica: "63e4a32e0f8f740d3dbf034e",
        },
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  let actDesarrolladas = [];

  test("Obtener todas las actividades desarrolladas de una actividad especifica", async () => {
    await api
      .get("/api/v1/desarrollada/63e4a32e0f8f740d3dbf034e")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .then((res) => {
        actDesarrolladas = res.body.actividadesDesarrolladas;
      });
  });

  test("Editar una actividad desarrollada", async () => {
    await api
      .put(
        "/api/v1/desarrollada/" +
          actDesarrolladas[actDesarrolladas.length - 1]._id
      )
      .set("Authorization", `bearer ${token}`)
      .send({
        actividadDesarrollada: {
          nombre: "Actividad desarrollada update",
        },
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Eliminar una actividad desarrollada", async () => {
    await api
      .delete(
        "/api/v1/desarrollada/" +
          actDesarrolladas[actDesarrolladas.length - 1]._id
      )
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

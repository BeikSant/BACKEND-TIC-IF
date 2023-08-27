import { token } from "../config/config.test";
import supertest from "supertest";
import { app } from "../../index";

const api = supertest(app);
let docentes = [];

describe("Pruebas API docente", () => {

  test("Agregar un docente", async () => {
    await api
      .post("/api/v1/docente")
      .set("Authorization", `bearer ${token}`)
      .send({
        primerNombre: "Prueba",
        segundoNombre: "Prueba",
        primerApellido: "Prueba",
        segundoApellido: "Prueba",
        correo: "prueba.prueba@unl.edu.ec",
        dedicacion: "Tiempo Completo",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Obtener todos los docentes", async () => {
    await api
      .get("/api/v1/docente")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .then((res) => {
        docentes = res.body;
      });
  });

  test("Obtener un docentes", async () => {
    await api
      .get("/api/v1/docente/one")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Editar un docente", async () => {
    await api
      .patch("/api/v1/docente/" + docentes[docentes.length - 1]._id)
      .set("Authorization", `bearer ${token}`)
      .send({
        primerNombre: "Prueba 1",
        segundoNombre: "Prueba 1",
        primerApellido: "Prueba 1",
        segundoApellido: "Prueba 1",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

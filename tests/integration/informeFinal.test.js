import { token } from "../config/config.test";
import supertest from "supertest";
import { app } from "../../index";

const api = supertest(app);
let docentes = [];

describe("Pruebas API informe final", () => {

  test("Agregar todos los informes del docente", async () => {
    await api
      .get("/api/v1/informe")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Obtener todos los docentes", async () => {
    await api
      .get("/api/v1/informe/all/63bc4d90f02f654d21be7d1c")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  });

  test("Obtener uno del docente por periodo", async () => {
    await api
      .get("/api/v1/informe/63bc4d90f02f654d21be7d1c")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

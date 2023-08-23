import { token } from "./config/config.test";
import supertest from "supertest";
import { app } from "../index";

const api = supertest(app);
let conclusiones = [];

describe("Pruebas API conclusiones y/o recomendaciones", () => {
  test("Agregar una conclusion y/o recomendacion", async () => {
    await api
      .post("/api/v1/conclusionrecomendacion/")
      .set("Authorization", `bearer ${token}`)
      .send({
        nombre: "Conclusion y/o Recomendacion",
        informe: "6460f642754b8688b4ccf4df",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Obtener todas las conclusiones y/o recomendaciones de un informe final", async () => {
    await api
      .get("/api/v1/conclusionrecomendacion/6460f642754b8688b4ccf4df")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .then((res) => {
        conclusiones = res.body;
      });
  });

  test("Editar una conclusion y/o recomendacion", async () => {
    await api
      .put(
        "/api/v1/conclusionrecomendacion/" +
          conclusiones[conclusiones.length - 1]._id
      )
      .set("Authorization", `bearer ${token}`)
      .send({
        nombre: "Conclusion y/o Recomendacion editada",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Eliminar una conclusion y/o recomendacion", async () => {
    await api
      .delete(
        "/api/v1/conclusionrecomendacion/" +
          conclusiones[conclusiones.length - 1]._id
      )
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

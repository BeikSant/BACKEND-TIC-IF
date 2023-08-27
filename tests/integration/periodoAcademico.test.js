import { token } from "../config/config.test";
import supertest from "supertest";
import { app } from "../../index";

const api = supertest(app);
let periodos = [];

describe("Pruebas API periodo academico", () => {
  test("Agregar un periodo academico", async () => {
    await api
      .post("/api/v1/periodo")
      .set("Authorization", `bearer ${token}`)
      .send({
        periodo: {
          nombre: "Nombre periodo",
          fechaInicio: new Date(),
          fechaFin: new Date(),
        },
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Obtener todas los periodos academicos", async () => {
    await api
      .get("/api/v1/periodo")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .then((res) => {
        periodos = res.body.periodos;
      });
  });

  test("Obtener periodo academicos activo", async () => {
    await api
      .get("/api/v1/periodo/activo")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Editar una periodo", async () => {
    await api
      .put("/api/v1/periodo/" + periodos[0]._id)
      .set("Authorization", `bearer ${token}`)
      .send({
        actividad: {
          nombre: "Periodo editado",
        },
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Eliminar un periodo", async () => {
    await api
      .delete("/api/v1/periodo/" + periodos[0]._id)
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

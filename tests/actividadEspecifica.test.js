import { token } from "./config/config.test";
import supertest from "supertest";
import { app } from "../index";

const api = supertest(app);
let actividadesEspecificas = [];

describe("Pruebas API actividad especifica", () => {
  test("Obtener todas las actividades especificas de un informe final", async () => {
    await api
      .get("/api/v1/especifica/6460f642754b8688b4ccf4df")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .then((res) => {
        actividadesEspecificas = res.body.actividadesEspecificas;
      });
  });

  test("Agregar una actividad especifica", async () => {
    await api
      .post(
        "/api/v1/especifica/6460f642754b8688b4ccf4df/640abaa2a301ae580b94484f"
      )
      .set("Authorization", `bearer ${token}`)
      .send({
        actividad: {
          nombre: "Actividad especifica",
          horas: 10,
          requerido: false,
        },
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Editar una actividad especifica", async () => {
    await api
      .patch(
        "/api/v1/especifica/" +
          actividadesEspecificas[actividadesEspecificas.length - 1]._id
      )
      .set("Authorization", `bearer ${token}`)
      .send({
        actividad: {
          nombre: "Actividad especifica edit",
          horas: 20,
        },
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Eliminar una actividad especifica", async () => {
    await api
      .delete(
        "/api/v1/especifica/" +
          actividadesEspecificas[actividadesEspecificas.length - 1]._id
      )
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

import { token } from "./config/config.test";
import supertest from "supertest";
import { app } from "../index";

const api = supertest(app);
let actsDistributivo = [];

describe("Pruebas API actividades distributivo", () => {

  test("Obtener todas las actividades del distributivo actuales", async () => {
    await api
      .get("/api/v1/distributivo")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .then((res) => {
        actsDistributivo = res.body.actividadesDistributivo;
      });
  });
});

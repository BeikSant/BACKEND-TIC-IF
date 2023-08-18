import supertest from "supertest";
import { app, server } from "../../index";
import mongoose from "mongoose";

const api = supertest(app);
let token = null;

beforeAll(async () => {
    await api
    .post("/api/v1/user/login")
    .send({ username: "beiker.santorum@unl.edu.ec", password: "19 beiker" })
    .then((response) => {
      token = response.body.token;
    })
});

describe("Inicio de pruebas", () => {
  test('Prueba de incio ', () => {
  });
})

afterAll(async () => {
  await server.close();
  await mongoose.connection.close();
});

export { token, api };

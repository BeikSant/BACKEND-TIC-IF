import supertest from "supertest";
import { app, server } from "../index";
import mongoose from "mongoose";

const api = supertest(app);
let token = ''

beforeAll(function () {});

describe("Inicios de sesion", () => {
  test("inicio con credenciales válidas", async () => {
    await api
      .post("/api/v1/user/login")
      .send({ username: "beiker.santorum@unl.edu.ec", password: "19 beiker" })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .then(response => {
        token = response.body.token;
    });
  });

  test("inicio con credenciales no válidas", async () => {
    await api
      .post("/api/v1/user/login")
      .send({ username: "user", password: "password" })
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });
});

describe("Cambiar contraseña", () => {
    test("contraseña actual valida", async () => {
      await api
        .put("/api/v1/user/changepassword")
        .set('Authorization', `bearer ${token}`)
        .send({ password: "18 beiker", newpassword: "19 beiker" })
        .expect(404)
        .expect("Content-Type", /application\/json/)
    });
  
    test("contraseña actual no válida", async () => {
        await api
        .put("/api/v1/user/changepassword")
        .set('Authorization', `bearer ${token}`)
        .send({ password: "19 beiker", new_password: "19 beiker" })
        .expect(200)
        .expect("Content-Type", /application\/json/)
    });
  });
  

afterAll(() => {
  server.close();
  mongoose.connection.close();
});

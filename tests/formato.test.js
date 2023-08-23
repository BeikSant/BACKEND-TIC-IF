import { token } from "./config/config.test";
import supertest from "supertest";
import { app } from "../index";

const api = supertest(app);
let formatos = [];

describe("Pruebas API formato del informe", () => {
  test("Agregar un formato", async () => {
    await api
      .post("/api/v1/formato")
      .set("Authorization", `bearer ${token}`)
      .send({
        formato: {
          nombreFormato:
            "FORMATO DE INFORME FINAL DE CUMPLIMIENTO DEL TRABAJO ACADÉMICO",
          facultad: "Facultad",
          carrera: "Carrera",
          docente: "Docente",
          dedicacion: "Dedicación",
          periodoAcademico: "Periodo académico ordinario (PAO)",
          totalHoras:
            "Total horas planificadas en el PAO, segun dedicación docente",
          funcionesSustantivas: "Funciones Sustantivas",
          horasPAO: "Horas del PAO",
          actividadesDesarrolladas: "Actividades desarrolladas",
          evidencias: "Evidencias",
          observaciones: "Observaciones",
          conclusiones: "CONCLUSIÓN Y/O RECOMENDACIÓN",
          estado: true,
          tipo: "POR DEFECTO",
          actividadesDistributivo: "Actividades del distributivo docente",
        },
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Obtener todos los formatos", async () => {
    await api
      .get("/api/v1/formato")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .then((res) => {
        formatos = res.body.formatos;
      });
  });

  test("Obtener formato por defecto", async () => {
    await api
      .get("/api/v1/formato/defecto")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Obtener formato por active", async () => {
    await api
      .get("/api/v1/formato/active")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Obtener un formato por su id", async () => {
    await api
      .get("/api/v1/formato/" + formatos[formatos.length - 1]._id)
      .set("Authorization", `bearer ${token}`)
      .send({
        formato: {},
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Editar una formato", async () => {
    await api
      .patch("/api/v1/formato/" + formatos[formatos.length - 1]._id)
      .set("Authorization", `bearer ${token}`)
      .send({
        formato: {},
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Eliminar un formato", async () => {
    await api
      .delete("/api/v1/formato/" + formatos[formatos.length - 2]._id)
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

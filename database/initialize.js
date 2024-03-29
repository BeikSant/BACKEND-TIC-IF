import docenteModel from "../models/docente.model.js";
import rolModel from "../models/rol.model.js";
import facultadModel from "../models/facultad.model.js";
import usuarioModel from "../models/usuario.model.js";
import carreraModel from "../models/carrera.model.js";
import formatoModel from "../models/formato.model.js";

export default {
  async initData() {
    console.info("Verificando si existen datos en la base de datos");
    try {
      const usuarios = await usuarioModel.find();
      if (usuarios.length != 0)
        return console.info("Ya existen datos registrados en la base de datos");
      const dataFacultad = {
        nombre:
          "Facultad de la Energía, las Industrias y los Recursos Naturales no Renovables",
        siglas: "FEIRNNR",
      };
      const facultad = await facultadModel.create(dataFacultad);
      const dataCarrera = {
        nombre: "Ingeniería en Computación",
        siglas: "IC",
        facultad: facultad._id,
      };
      const carrera = await carreraModel.create(dataCarrera);
      const dataRol1 = {
        nombre: "docente",
        descripcion: "Es el usuario normal del sistema",
      };
      const dataRol2 = {
        nombre: "director",
        descripcion: "Es el administrador del sistema",
      };

      await rolModel.create(dataRol1);
      const rol2 = await rolModel.create(dataRol2);
      const dataUsuario = {
        username: "beiker.santorum@unl.edu.ec",
        password: process.env.PASSWORD_INIT,
        rol: rol2._id,
      };
      const usuario = await usuarioModel.create(dataUsuario);
      const newDataDocente = {
        primerNombre: "Beiker",
        segundoNombre: "Antonio",
        primerApellido: "Santorum",
        segundoApellido: "Sasaguay",
        correo: "beiker.santorum@unl.edu.ec",
        dedicacion: "Tiempo Completo",
        carrera: carrera._id,
        usuario: usuario._id,
      };
      await docenteModel.create(newDataDocente);
      const dataFormato = {
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
      };
      await formatoModel.create(dataFormato);
      return (
        "Datos predeterminados cargados a la base de datos con normalidad"
      );
    } catch (error) {
      console.error(
        "Ocurrió un error al inicializar los datos predeterminados en MongoDB:",
        error
      );
    }
  },
};

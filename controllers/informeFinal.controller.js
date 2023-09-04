import mongoose from "mongoose";
import docenteModel from "../models/docente.model.js";
import formatoModel from "../models/formato.model.js";
import evidenciaModel from "../models/evidencia.model.js";
import actividadDesarrolladaModel from "../models/actividadDesarrollada.model.js";
import observacionModel from "../models/observacion.model.js";
import informeModel from "../models/informe.model.js";
import periodoAcademicoModel from "../models/periodoAcademico.model.js";
import actividadEspecificaModel from "../models/actividadEspecifica.model.js";
import conclusionModel from "../models/conclusion_recomendacion.model.js";
import { generarInformePDF } from "../utils/generatePDF.js";

const informeFinalController = {
  obtenerTodosPorPeriodo: async (req, res) => {
    if (!req.user)
      return res.status(404).json({ message: "No se encontró al docente" });
    const idPeriodo = req.params.periodo;
    try {
      const periodoAcademico = await periodoAcademicoModel.findById(idPeriodo);
      if (!periodoAcademico)
        return res
          .status(404)
          .json({ message: "No se pudo encontrar el periodo académico" });
      const informes = await informeModel
        .find({ periodoAcademico: idPeriodo })
        .populate("docente");
      return res.status(200).json({ informes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  obtenerPorPeriodo: async (req, res) => {
    if (!req.user)
      return res.status(404).json({ message: "No se encontró al docente" });
    const periodo = req.params.periodo;
    const id = req.user.docente;
    try {
      //const docente = await docenteModel.findById(id)
      const docente = await docenteModel.findById(id);
      if (!docente)
        return res
          .status(404)
          .json({ message: "No se pudo encontrar al docente" });
      const periodoAcademico = await periodoAcademicoModel.findById(periodo);
      if (!periodoAcademico)
        return res
          .status(404)
          .json({ message: "No se pudo encontrar el periodo académico" });
      let informe = await informeModel.findOne({
        docente: docente.id,
        periodoAcademico: periodoAcademico.id,
      });
      if (!informe && periodoAcademico.estado === false)
        return res.status(404).json({ message: "El informe final no existe" });
      if (!informe)
        informe = await informeModel.create({
          docente: docente.id,
          periodoAcademico: periodoAcademico.id,
        });
      return res.status(200).json({
        message: "Se pudo obtener el informe final",
        informeFinal: informe,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  obtenerTodosPorDocente: async (req, res) => {
    if (!req.user)
      return res.status(404).json({ message: "No se encontró al docente" });
    const id = req.user.docente;
    try {
      const docente = await docenteModel.findById(id);
      if (!docente)
        return res.status(404).json({ message: "No se encontró al docente" });
      const informes = await informeModel
        .find({ docente: docente.id })
        .sort({ created_at: "desc" })
        .populate(["periodoAcademico"])
        .lean();
      if (!informes)
        return res
          .status(404)
          .json({ message: "No se pudo obtener los informes del docente" })(
          informes
        );
      for (const informe of informes) {
        if (informe.periodoAcademico == null) {
          await informeModel.findByIdAndDelete(informes[i]._id);
        }
      }
      return res.status(200).json({ informes: informes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  asignarFormato: async (req, res) => {
    const id = req.params.informe;
    const idFormato = req.params.formato;
    if (!mongoose.isValidObjectId(idFormato))
      return res.status(404).json({ message: "No se encontró el formato" });
    if (!mongoose.isValidObjectId(id))
      return res
        .status(404)
        .json({ message: "No se encontró el informe final" });
    const informe = await informeModel.findById(id);
    if (!informe)
      return res
        .status(404)
        .json({ message: "No se encontró el informe final" });
    const formato = await formatoModel.findById(idFormato);
    if (!formato)
      return res.status(404).json({ message: "No se encontró el formato" });
    await informe.updateOne({ formato: formato.id });
    return res.status(200).json({
      message: "El formato se ha asigando al informe final con éxito",
    });
  },

  guardarInformeFirmaDocente: async (req, res) => {
    if (!req.file)
      return res
        .status(404)
        .json({ message: "Debe proporcionar un documento" });
    if (!req.body.firmado_por)
      return res.status(404).json({
        message: "Proporcione si firmado_por es por 'docente' o 'director'",
      });
    if (req.body.firmado_por == "docente") {
      req.periodo._id.toString();
      const informe = await informeModel.findOne({
        docente: req.user.docente,
        periodoAcademico: req.periodo._id.toString(),
      });
      await informe.updateOne({
        documento_firma_docente: req.periodo.nombre + "/" + req.nombreDocumento,
        estado: "enviadoFirmar",
      });
    } else if (req.body.firmado_por == "director") {
      const informe = await informeModel.findOne({
        docente: req.body.docente,
        periodoAcademico: req.periodo._id.toString(),
      });
      await informe.updateOne({
        documento_firma_director:
          req.periodo.nombre + "/" + req.nombreDocumento,
        estado: "completado",
      });
    }
    return res
      .status(200)
      .json({ message: "Informe final guardado con éxito" });
  },

  async generarInforme(req, res) {
    const id = req.user.docente;
    const informeId = req.params.informe;
    const docente = await docenteModel
      .findById(id)
      .populate({
        path: "carrera",
        populate: "facultad",
      })
      .lean();
    const informe = await informeModel
      .findById(informeId)
      .populate("periodoAcademico")
      .lean();
    if (!informe)
      return res
        .status(404)
        .json({ message: "No se encontró el informe final" });
    const formato = await formatoModel.findOne({ estado: true }).lean();
    const conclusiones = await conclusionModel
      .find({ informe: informe._id })
      .sort({ orden: 1 })
      .lean();
    const actividades = await actividadEspecificaModel
      .find({ informeFinal: informe._id })
      .populate({
        path: "actividadDistributivo",
        populate: {
          path: "funcionSustantiva",
        },
      })
      .sort({ nombre: 1 })
      .lean();
    const funcionesSustantivas = [];
    informe.horas = 0;
    informe.fecha = new Date().toLocaleDateString("en-GB");
    for (const ac of actividades) {
      const actDesarrolladas = await actividadDesarrolladaModel
        .find({
          actividadEspecifica: ac._id,
        })
        .sort({ orden: 1 })
        .lean();
      const evidencias = await evidenciaModel
        .find({
          actividadEspecifica: ac._id,
        })
        .sort({ orden: 1 })
        .lean();
      const observaciones = await observacionModel
        .find({
          actividadEspecifica: ac._id,
        })
        .sort({ orden: 1 })
        .lean();
      const funcionSustantiva = {
        ...ac.actividadDistributivo.funcionSustantiva,
      };
      let fsFind = funcionesSustantivas.find(
        (f) => f._id == funcionSustantiva._id
      );
      delete ac.actividadDistributivo;
      if (!fsFind) {
        funcionesSustantivas.push({
          ...funcionSustantiva,
          actEspecificas: [
            { ...ac, actDesarrolladas, evidencias, observaciones },
          ],
        });
      } else {
        fsFind.actEspecificas.push({
          ...ac,
          actDesarrolladas,
          evidencias,
          observaciones,
        });
      }
      informe.horas += ac.horas;
    }
    const pdf = await generarInformePDF({
      informe,
      formato,
      docente,
      funcionesSustantivas,
      conclusiones,
    });
    return res.status(200).json({pdf});
  },

  cambiarEstado: async (req, res) => {
    const idInforme = req.params.informe;
    if (!mongoose.isValidObjectId(idInforme))
      return res
        .status(404)
        .json({ message: "No se encontró el informe final" });
    const informe = await informeModel.findById(idInforme);
    if (!informe)
      return res
        .status(404)
        .json({ message: "No se encontró el informe final" });
    await informe.updateOne({ estado: req.body.estado });
    return res
      .status(200)
      .json({ message: "Ha cambiado el estado de informe" });
  },
};

export default informeFinalController;

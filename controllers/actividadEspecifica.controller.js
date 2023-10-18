import mongoose from "mongoose";
import actividadDistributivoModel from "../models/actividadDistributivo.model.js";
import actividadEspecificaModel from "../models/actividadEspecifica.model.js";
import informeModel from "../models/informe.model.js";

const actividadEspecificaController = {};

//Obtiene todas las actividades especificas de un informe final
actividadEspecificaController.obtenerPorInforme = async (req, res) => {
  try {
    const idInforme = req.params.informe;
    const idFuncionSustantiva = req.params.idFuncionSustantiva;
    if (!mongoose.isValidObjectId(idInforme))
      return res.status(404).json({ message: "Informe no encontrado" });
    const informe = await informeModel.findById(idInforme);
    if (!informe)
      return res.status(404).json({ message: "Informe no encontrado" });

    const actividades = await actividadEspecificaModel.aggregate([
      {
        $match: { informeFinal: informe._id },
      },
      {
        $lookup: {
          from: "actividaddistributivos", // Nombre de la colección de actividadDistributivo
          localField: "actividadDistributivo",
          foreignField: "_id",
          as: "actividadDistributivo_docs",
        },
      },
      {
        $match: {
          "actividadDistributivo_docs.funcionSustantiva":
            mongoose.Types.ObjectId(idFuncionSustantiva),
        },
      },
      {
        $lookup: {
          from: "evidencias",
          localField: "_id",
          foreignField: "actividadEspecifica",
          as: "evidencias_docs",
        },
      },
      {
        $lookup: {
          from: "observacions",
          localField: "_id",
          foreignField: "actividadEspecifica",
          as: "observaciones_docs",
        },
      },
      {
        $lookup: {
          from: "actividaddesarrolladas",
          localField: "_id",
          foreignField: "actividadEspecifica",
          as: "actDesarrolladas_docs",
        },
      },
      {
        $addFields: {
          evidencias: { $size: "$evidencias_docs" },
          observaciones: { $size: "$observaciones_docs" },
          actividadesDesarrolladas: { $size: "$actDesarrolladas_docs" },
        },
      },
      {
        $project: {
          evidencias_docs: 0,
          observaciones_docs: 0,
          actDesarrolladas_docs: 0,
          actividadDistributivo_docs: 0,
        },
      },
    ]);

    return res.status(200).json(actividades);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error interno del servidor");
  }
};

//Permite guardar una actividad especifica en un informe final
actividadEspecificaController.guardar = async (req, res) => {
  const idInforme = req.params.informe.toString();
  const idDistributivo = req.params.distributivo.toString();
  const actividad = {
    nombre: req.body.actividad.nombre.toString(),
    horas: +req.body.actividad.horas,
    informeFinal: idInforme,
    requerido: req.body.actividad.requerido,
    actividadDistributivo: idDistributivo,
  };
  if (!mongoose.isValidObjectId(idInforme))
    return res.status(404).json({ message: "No existe el informe final" });
  if (!mongoose.isValidObjectId(idDistributivo))
    return res
      .status(404)
      .json({ message: "No existe la actividad del distributivo" });
  const informe = await informeModel.findById(idInforme);
  if (!informe)
    return res.status(404).json({ message: "No existe el informe final" });
  const actividadDistributivo = await actividadDistributivoModel.findById(
    idDistributivo
  );
  if (!actividadDistributivo)
    return res
      .status(404)
      .json({ message: "No existe la actividad del distributivo" });
  const actividadEspecifica = await (
    await actividadEspecificaModel.create(actividad)
  ).populate({
    path: "actividadDistributivo",
    populate: {
      path: "funcionSustantiva",
    },
  });
  if (!actividadEspecifica)
    return res
      .status(404)
      .json({ message: "Ocurrió un error al guardar la actividad" });
  return res.status(200).json({
    message: "Se ha guardado la actividad con éxito",
    actividadEspecifica,
  });
};

actividadEspecificaController.eliminar = async (req, res) => {
  const idActividad = req.params.especifica;
  if (!mongoose.isValidObjectId(idActividad))
    return res
      .status(404)
      .json({ message: "No se ha podido encontrar la actividad" });
  const actividad = await actividadEspecificaModel.findById(idActividad);
  if (!actividad)
    return res
      .status(404)
      .json({ message: "No se ha podido encontrar la actividad" });
  if (actividad.requerido)
    return res
      .status(404)
      .json({ message: "No puede eliminar esta actividad" });
  await actividad.delete();
  return res.status(200).json({ message: "Actividad eliminada con éxito" });
};

//Edita la informacion de una actividad específica
actividadEspecificaController.actualizar = async (req, res) => {
  const idActividad = req.params.id;
  const actividad = req.body.actividad;
  if (!mongoose.isValidObjectId(idActividad))
    return res
      .status(404)
      .json({ message: "No se ha podido encontrar la actividad" });
  const actividadEspecifica = await actividadEspecificaModel.findById(
    idActividad
  );
  if (!actividadEspecifica)
    return res
      .status(404)
      .json({ message: "No se ha podido encontrar la actividad" });
  await actividadEspecifica.updateOne(actividad);
  return res.status(200).json({ message: "Actividad actualizada con éxito" });
};

export default actividadEspecificaController;

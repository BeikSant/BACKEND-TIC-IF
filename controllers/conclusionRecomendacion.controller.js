import mongoose from "mongoose";
import conclusionRecomendacionModel from "../models/conclusion_recomendacion.model.js";
import informeModel from "../models/informe.model.js";

export default {
  async guardar(req, res) {
    let conclusion_recomendacion = {
      nombre: req.body.nombre.toString(),
      informe: req.body.informe.toString(),
    };
    if (!mongoose.isValidObjectId(conclusion_recomendacion.informe))
      return res.status(404).json({ message: "No se encontró el informe" });
    const informe = await informeModel.findById(
      conclusion_recomendacion.informe
    );
    if (!informe)
      return res.status(404).json({ message: "No se encontró el informe" });
    const conclusiones = await conclusionRecomendacionModel.find({
      informe: informe._id,
    });
    conclusion_recomendacion.orden = conclusiones.length + 1;
    const con_rec = await conclusionRecomendacionModel.create(
      conclusion_recomendacion
    );
    if (!con_rec)
      return res.status(404).json({
        message: "Ocurrió un error al guardar la conclusion y/o recomendación",
      });
    return res.status(200).json({
      message: "La conclusion y/o recomendacion se ha guadado con éxito",
    });
  },

  async obtenerPorInforme(req, res) {
    const informe = req.params.informe;
    const conclusiones = await conclusionRecomendacionModel
      .find({ informe: informe })
      .sort({ orden: 1 });
    if (!conclusiones)
      return res.status(404).json({
        message:
          "Ocurrió un error al obtener la conclusiones y/o recomendaciones",
      });
    return res.status(200).json(conclusiones);
  },

  async editar(req, res) {
    const id = req.params.id;
    const bodyConclusion = req.body;
    if (!mongoose.isValidObjectId(id))
      return res.status(404).message({
        message: "No se encontró la  conclusion y/o recomendacion",
      });
    const conclusion = await conclusionRecomendacionModel.findById(id);
    if (!conclusion)
      return res.status(404).message({
        message: "No se encontró la  conclusion y/o recomendacion",
      });
    if (bodyConclusion.orden && conclusion.orden != bodyConclusion.orden) {
      if (conclusion.orden > bodyConclusion.orden) {
        await conclusionRecomendacionModel.updateMany(
          {
            informe: conclusion.informe,
            $and: {
              orden: { $gte: bodyConclusion.orden },
              orden: { $lt: conclusion.orden },
            },
          },
          { $inc: { orden: +1 } }
        );
      } else {
        await conclusionRecomendacionModel.updateMany(
          {
            informe: conclusion.informe,
            $and: {
              orden: { $gt: conclusion.orden },
              orden: { $lte: bodyConclusion.orden },
            },
          },
          { $inc: { orden: -1 } }
        );
      }
    }
    await conclusion.updateOne(bodyConclusion);
    return res
      .status(200)
      .json("La conclusión y/o recomendación se ha editado con éxito");
  },

  async eliminar(req, res) {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(404).message({
        message: "No se encontró la  conclusion y/o recomendacion",
      });
    const conclusion = await conclusionRecomendacionModel.findById(id);
    if (!conclusion)
      return res.status(404).message({
        message: "No se encontró la  conclusion y/o recomendacion",
      });
    await conclusion.delete();
    await conclusionRecomendacionModel.updateMany(
      { informe: conclusion.informe, orden: { $gt: conclusion.orden } },
      { $inc: { orden: -1 } }
    );
    return res
      .status(200)
      .json("La conclusión y/o recomendación se ha eliminado con éxito");
  },
};

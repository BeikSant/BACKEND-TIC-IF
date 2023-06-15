import mongoose from "mongoose"
import actividadDesarrolladaModel from "../models/actividadDesarrollada.model.js"
import actividadDistributivoModel from "../models/actividadDistributivo.model.js"
import actividadEspecificaModel from "../models/actividadEspecifica.model.js"
import evidenciaModel from "../models/evidencia.model.js"
import informeModel from "../models/informe.model.js"
import observacionModel from "../models/observacion.model.js"

const actividadEspecificaController = {}

//Obtiene todas las actividades especificas de un informe final
actividadEspecificaController.obtenerPorInforme = async (req, res) => {
    try {
        const idInforme = req.params.informe
        if (!mongoose.isValidObjectId(idInforme)) return res.status(404).json({ message: "No existe el informe final" })
        const informe = await informeModel.findById(idInforme)
        if (!informe) return res.status(404).json({ message: "No existe el informe final" })
        const actividades = await actividadEspecificaModel.find({ informeFinal: informe.id }).populate({
            path: 'actividadDistributivo',
            populate: {
                path: 'funcionSustantiva',
            }
        }).sort({ nombre: 1 }).lean()
        for (const actividad of actividades) {
            actividad.observacion = await observacionModel.find({ actividadEspecifica: actividad._id }).count();
            actividad.evidencia = await evidenciaModel.find({ actividadEspecifica: actividad._id }).count();
            actividad.actividadDesarrollada = await actividadDesarrolladaModel.find({ actividadEspecifica: actividad._id }).count();
        }
        return res.status(200).json({
            message: actividades < 1 ? "No existen actividades específicas del informe final" : "Se pudo obtener las actividades del informe final",
            actividadesEspecificas: actividades
        })
    } catch (error) {
        console.log(error)
    }

}

//Permite guardar una actividad especifica en un informe final
actividadEspecificaController.guardar = async (req, res) => {
    const idInforme = req.params.informe.toString()
    const idDistributivo = req.params.distributivo.toString()
    const actividad = {
        nombre: req.body.actividad.nombre.toString(),
        horas: +req.body.actividad.horas,
        informeFinal: idInforme,
        requerido: req.body.actividad.requerido,
        actividadDistributivo: idDistributivo
    }
    if (!mongoose.isValidObjectId(idInforme)) return res.status(404).json({ message: "No existe el informe final" })
    if (!mongoose.isValidObjectId(idDistributivo)) return res.status(404).json({ message: "No existe la actividad del distributivo" })
    const informe = await informeModel.findById(idInforme)
    if (!informe) return res.status(404).json({ message: "No existe el informe final" })
    const actividadDistributivo = await actividadDistributivoModel.findById(idDistributivo)
    if (!actividadDistributivo) return res.status(404).json({ message: "No existe la actividad del distributivo" })
    const actividadEspecifica = await actividadEspecificaModel.create(actividad)
    if (!actividadEspecifica) return res.status(404).json({ message: "No se pudo crear la actividad especifica" })
    return res.json(200).status({ message: "La actividad especifica se ha creado con éxito" })
}

actividadEspecificaController.eliminar = async (req, res) => {
    const idActividad = req.params.especifica
    if (!mongoose.isValidObjectId(idActividad)) return res.status(404).json({ message: "No se encontro la actividad especifica del informe final" })
    const actividad = await actividadEspecificaModel.findById(idActividad)
    if (!actividad) return res.status(404).json({ message: "No se encontro la actividad especifica del informe final" })
    if (actividad.requerido) return res.status(404).json({ message: "No puede eliminar esta actividad" })
    await actividad.delete()
    return res.status(200).json({ message: "Se eliminó la actividad específica con éxito" })
}

//Edita la informacion de una actividad específica
actividadEspecificaController.actualizar = async (req, res) => {
    const idActividad = req.params.id
    const actividad = req.body.actividad
    console.log(actividad)
    if (!mongoose.isValidObjectId(idActividad)) return res.status(400).json({ message: "No se ha podido encontrar la actividad especifica" })
    const actividadEspecifica = await actividadEspecificaModel.findById(idActividad)
    if (!actividadEspecifica) return res.status(400).json({ message: "No se ha podido encontrar la actividad especifica" })
    await actividadEspecifica.update(actividad)
    return res.status(200).json({ message: "Se ha modificado la información de la actividad especifica con éxito" })
}

export default actividadEspecificaController
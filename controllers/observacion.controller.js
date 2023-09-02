import mongoose from "mongoose"
import actividadEspecificaModel from "../models/actividadEspecifica.model.js"
import observacionModel from "../models/observacion.model.js"

const observacionController = {}

observacionController.obtenerPorActividadEspecifica = async (req, res) => {
    const idEspecifica = req.params.especifica
    if (!mongoose.isValidObjectId(idEspecifica)) return res.status(404).json({ message: "No se encontró la actividad específica"})
    const actividadEspecifica = await actividadEspecificaModel.findById(idEspecifica)
    if (!actividadEspecifica) return res.status(404).json({ message: "No se encontró la actividad específica"})
    const observaciones = await observacionModel.find({actividadEspecifica: actividadEspecifica.id}).sort({orden: 1})
    if (!observaciones) return res.status(404).json({ message: "No se pudo obtener las observaciones de la actividad específica"})
    return res.status(200).json({observaciones: observaciones})
}

observacionController.guardar = async (req, res) =>{
    const idEspecifica = req.body.observacion.actividadEspecifica.toString()
    let observacionBody =  {
        nombre: req.body.observacion.nombre.toString(),
        actividadEspecifica: idEspecifica
    }
    if (!mongoose.isValidObjectId(idEspecifica)) return res.status(404).json({ message: "No se encontró la actividad específica"})
    const actividadEspecifica = await actividadEspecificaModel.findById(idEspecifica)
    if (!actividadEspecifica) return res.status(404).json({ message: "No se encontró la actividad específica"})
    const observaciones = await observacionModel.find({actividadEspecifica: idEspecifica})
    observacionBody.orden = observaciones.length ? (observaciones.length + 1) : 1
    const observacion = await observacionModel.create(observacionBody)
    if (!observacion) return res.status(404).json({ message: "No se pudo guardar la observación"})
    return res.status(200).json({ message: "La observación se ha guardado con éxito"})
}

observacionController.eliminar = async (req, res) => {
    const id = req.params.id
    if (!mongoose.isValidObjectId(id))  return res.status(404).json({ message: "No se encontró la observación"})
    const observacion = await observacionModel.findById(id)
    if (!observacion) return res.status(404).json({ message: "No se encontró la observación"})
    await ordenarObservacionEliminar(observacion.orden, observacion.actividadEspecifica)
    await observacion.delete()
    return res.status(200).json({ message: "La observación se eliminó con éxito"})
}

observacionController.editar = async (req, res) => {
    const id = req.params.id
    const observacionBody = req.body.observacion
    if (!mongoose.isValidObjectId(id))  return res.status(404).json({ message: "No se encontró la observación"})
    const observacion = await observacionModel.findById(id)
    if (!observacion) return res.status(404).json({ message: "No se encontró la observación"})
    if (observacionBody.orden && observacion.orden != observacionBody.orden ){
        await ordenarObservacion(observacion.orden, observacionBody.orden, observacion.actividadEspecifica)
    }
    await observacion.updateOne(observacionBody)
    return res.status(200).json({ message: "La observación se editó con éxito"})
}

export default observacionController

async function ordenarObservacion(actual, nueva, actividadEspecifica){
    const observaciones = await observacionModel.find({ actividadEspecifica: actividadEspecifica }).sort({orden: 1})
    await observaciones[nueva - 1].updateOne({orden: actual})
}

async function ordenarObservacionEliminar(posicion, actividadEspecifica){
    let observaciones = await observacionModel.find({ actividadEspecifica: actividadEspecifica }).sort({orden: 1})
    if (posicion == observaciones.length) return 0
    for (let i = posicion ; i < observaciones.length; i++) {
        await observaciones[i].updateOne({orden: i})
    }
}
import mongoose from "mongoose"
import actividadEspecificaModel from "../models/actividadEspecifica.model.js"
import evidenciaModel from "../models/evidencia.model.js"

const evidenciaController = {}

evidenciaController.obtenerPorActividadEspecifica = async (req, res) => {
    const idEspecifica = req.params.especifica
    if (!mongoose.isValidObjectId(idEspecifica)) return res.status(404).json({ message: "No se encontró la actividad específica"})
    const actividadEspecifica = await actividadEspecificaModel.findById(idEspecifica)
    if (!actividadEspecifica) return res.status(404).json({ message: "No se encontró la actividad específica"})
    const evidencias = await evidenciaModel.find({actividadEspecifica: actividadEspecifica.id}).sort({orden: 1})
    if (!evidencias) return res.status(404).json({ message: "No se pudo obtener las evidencias de la actividad específica"})
    return res.status(200).json({evidencias: evidencias})
}

evidenciaController.guardar = async (req, res) =>{
    const idEspecifica = req.body.evidencia.actividadEspecifica.toString()
    let evidenciaBody =  {
        nombre: req.body.evidencia.toString(),
        actividadEspecifica: idEspecifica
    }
    if (!mongoose.isValidObjectId(idEspecifica)) return res.status(404).json({ message: "No se encontró la actividad específica"})
    const actividadEspecifica = await actividadEspecificaModel.findById(idEspecifica)
    if (!actividadEspecifica) return res.status(404).json({ message: "No se encontró la actividad específica"})
    const evidencias = await evidenciaModel.find({actividadEspecifica: idEspecifica})
    const orden = evidencias.length ? (evidencias.length + 1) : 1 
    evidenciaBody.orden = orden
    const evidencia = await evidenciaModel.create(evidenciaBody)
    if (!evidencia) return res.status(404).json({ message: "No se pudo guardar la evidencia"})
    return res.status(200).json({ message: "La evidencia se ha guardado con éxito"})
}

evidenciaController.eliminar = async (req, res) => {
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: "No se encontró la evidencia"})
    const evidencia = await evidenciaModel.findById(id)
    console.log(evidencia)
    if (!evidencia) return res.status(404).json({ message: "No se encontró la evidencia"})
    await ordenarEvidenciaEliminar(evidencia.orden, evidencia.actividadEspecifica)
    await evidencia.delete()
    return res.status(200).json({ message: "La evidencia se eliminó con éxito"})
}

evidenciaController.editar = async (req, res) =>{
    const id = req.params.id
    console.log(id)
    const evidenciaBody = req.body.evidencia
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: "No se encontró la evidencia"})
    const evidencia = await evidenciaModel.findById(id)
    if (!evidencia) return res.status(404).json({ message: "No se encontró la evidencia"})
    if (evidencia.orden && evidencia.orden != evidenciaBody.orden ){
        await ordenarEvidencia(evidencia.orden, evidenciaBody.orden, evidencia.actividadEspecifica)
    }
    await evidencia.update(evidenciaBody)
    return res.status(200).json({ message: "La evidencia se editó con éxito"})
}

export default evidenciaController


async function ordenarEvidencia(actual, nueva, actividadEspecifica){
    const evidencias = await evidenciaModel.find({ actividadEspecifica: actividadEspecifica }).sort({orden: 1})
    await evidencias[nueva - 1].updateOne({orden: actual})
}

async function ordenarEvidenciaEliminar(posicion, actividadEspecifica){
    let evidencias = await evidenciaModel.find({ actividadEspecifica: actividadEspecifica }).sort({orden: 1})
    if (posicion == evidencias.length) return 0
    for (let i = posicion ; i < evidencias.length; i++) {
        await evidencias[i].updateOne({orden: i})
    }
}
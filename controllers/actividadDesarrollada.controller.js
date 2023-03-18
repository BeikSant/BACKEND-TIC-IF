import mongoose from "mongoose"
import actividadDesarrolladaModel from "../models/actividadDesarrollada.model.js"
import actividadEspecificaModel from "../models/actividadEspecifica.model.js"

const actividadDesarrolladaController = {}

actividadDesarrolladaController.obtenerPorActividadEspecifica = async (req, res) => {
    const idEspecifica = req.params.especifica
    try {
        if (!mongoose.isValidObjectId(idEspecifica)) return res.status(404).json({ message: "No se encontró la actividad específica" })
        const actividadEspecifica = await actividadEspecificaModel.findById(idEspecifica)
        if (!actividadEspecifica) return res.status(404).json({ message: "No se encontró la actividad específica" })
        const actividadesDesarrolladas = await actividadDesarrolladaModel.find({ actividadEspecifica: actividadEspecifica.id }).sort({orden: 1})
        if (!actividadesDesarrolladas) return res.status(404).json({ message: "No se pudo obtener las actividades desarrolladas de la actividad específica" })
        return res.status(200).json({ actividadesDesarrolladas: actividadesDesarrolladas })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }

}

actividadDesarrolladaController.guardar = async (req, res) => {
    const idEspecifica = req.body.actividadDesarrollada.actividadEspecifica.toString()
    let actividadDesarrolladaBody = {
        nombre: req.body.actividadDesarrollada.toString(),
        actividadEspecifica: req.body.actividadDesarrollada.actividadEspecifica.toString()
    }
    try {
        if (!mongoose.isValidObjectId(idEspecifica)) return res.status(404).json({ message: "No se encontró la actividad específica" })
        const actividadEspecifica = await actividadEspecificaModel.findById(idEspecifica)
        if (!actividadEspecifica) return res.status(404).json({ message: "No se encontró la actividad específica" })
        const actividades = await actividadDesarrolladaModel.find({actividadEspecifica: idEspecifica})
        const orden = actividades.length ? (+ actividades.length + 1) : 0 
        actividadDesarrolladaBody.orden = orden
        const actividadDesarrollada = await actividadDesarrolladaModel.create(actividadDesarrolladaBody)
        if (!actividadDesarrollada) return res.status(404).json({ message: "No se pudo guardar la actividad desarrollada" })
        return res.status(200).json({ message: "La actividad desarrollada se ha guardado con éxito" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }

}

actividadDesarrolladaController.eliminar = async (req, res) => {
    const id = req.params.id
    try {
        if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: "No se encontró la actividad desarrollada" })
        const actividadDesarrollada = await actividadDesarrolladaModel.findById(id)
        if (!actividadDesarrollada) return res.status(404).json({ message: "No se encontró la actividad desarrollada" })
        await ordenarActividadesEliminar(actividadDesarrollada.orden, actividadDesarrollada.actividadEspecifica)
        await actividadDesarrollada.delete()
        return res.status(200).json({ message: "La actividad desarrollada se eliminó con éxito" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

actividadDesarrolladaController.editar = async (req, res) => {
    const id = req.params.id
    const actividadDesarrolladaBody = req.body.actividadDesarrollada
    console.log(actividadDesarrolladaBody)
    try {
        if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: "No se encontró la actividad desarrollada" })
        const actividadDesarrollada = await actividadDesarrolladaModel.findById(id)
        console.log(actividadDesarrollada)
        if (!actividadDesarrollada) return res.status(404).json({ message: "No se encontró la actividad desarrollada" })
        if (actividadDesarrolladaBody.orden && actividadDesarrollada.orden != actividadDesarrolladaBody.orden ){
            await ordenarActividades(actividadDesarrollada.orden, actividadDesarrolladaBody.orden, actividadDesarrollada.actividadEspecifica)
        }
        await actividadDesarrollada.updateOne(actividadDesarrolladaBody)
        return res.status(200).json({ message: "La actividad desarrollada se editó con éxito" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

export default actividadDesarrolladaController


async function ordenarActividades(actual, nueva, actividadEspecifica){
    const actividadesDesarrolladas = await actividadDesarrolladaModel.find({ actividadEspecifica: actividadEspecifica }).sort({orden: 1})
    await actividadesDesarrolladas[nueva - 1].updateOne({orden: actual})
}

async function ordenarActividadesEliminar(posicion, actividadEspecifica){
    let actividadesDesarrolladas = await actividadDesarrolladaModel.find({ actividadEspecifica: actividadEspecifica }).sort({orden: 1})
    if (posicion == actividadesDesarrolladas.length) return 0
    for (let i = posicion ; i < actividadesDesarrolladas.length; i++) {
        await actividadesDesarrolladas[i].updateOne({orden: i})
    }
}
import mongoose from "mongoose"
import conclusionRecomendacionModel from "../models/conclusion_recomendacion.model.js"
import informeModel from "../models/informe.model.js"

export default {
    async guardar(req, res){
        let conclusion_recomendacion = req.body
        if (!mongoose.isValidObjectId(conclusion_recomendacion.informe)) return res.status(404).json({message: 'No se encontró el informe'})
        const informe = await informeModel.findById(conclusion_recomendacion.informe)
        if (!informe) return res.status(404).json({message: 'No se encontró el informe'})
        const conclusiones = await conclusionRecomendacionModel.find({informe: informe._id})
        conclusion_recomendacion.orden = conclusiones.length + 1
        const con_rec = await conclusionRecomendacionModel.create(conclusion_recomendacion)
        if (!con_rec) return res.status(404).json({message: 'Ocurrió un error al guardar la conclusion y/o recomendación'})
        return res.status(200).json({message: 'La conclusion y/o recomendacion se ha guadado con éxito'}) 
    },

    async obtenerPorInforme(req, res) {
        const informe = req.params.informe
        const conclusiones = await conclusionRecomendacionModel.find({informe: informe}).sort({orden: 1})
        if (!conclusiones) return res.status(404).json({message: 'Ocurrió un error al obtener la conclusiones y/o recomendaciones'})
        return res.status(200).json(conclusiones)
    },

    async editar(req, res) {
        const id = req.params.id
        const bodyConclusion = req.body
        if (!mongoose.isValidObjectId(id)) return res.status(404).message({message: 'No se encontró la  conclusion y/o recomendacion'})
        const conclusion = await conclusionRecomendacionModel.findById(id)
        if (!conclusion) return res.status(404).message({message: 'No se encontró la  conclusion y/o recomendacion'})
        if (bodyConclusion.orden && conclusion.orden != bodyConclusion.orden ){
            await ordenarConclusion(conclusion.orden, bodyConclusion.orden, conclusion.informe)
        }
        await conclusion.updateOne(bodyConclusion)
        return res.status(200).json('La conclusión y/o recomendación se ha editado con éxito')
    },

    async eliminar(req, res) {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) return res.status(404).message({message: 'No se encontró la  conclusion y/o recomendacion'})
        const conclusion = await conclusionRecomendacionModel.findById(id)
        if (!conclusion) return res.status(404).message({message: 'No se encontró la  conclusion y/o recomendacion'})
        await ordenarConclusionEliminar(conclusion.orden, conclusion.informe)
        await conclusion.delete()
        return res.status(200).json('La conclusión y/o recomendación se ha eliminado con éxito')
    }
}

async function ordenarConclusion(actual, nueva, informe){
    const conclusion = await conclusionRecomendacionModel.find({informe}).sort({orden: 1})
    await conclusion[nueva - 1].updateOne({orden: actual})
}

async function ordenarConclusionEliminar(posicion, informe){
    let conclusiones = await conclusionRecomendacionModel.find({ informe }).sort({orden: 1})
    if (posicion == conclusiones.length) return 0
    for (let i = posicion ; i < conclusiones.length; i++) {
        await conclusiones[i].updateOne({orden: i})
    }
}
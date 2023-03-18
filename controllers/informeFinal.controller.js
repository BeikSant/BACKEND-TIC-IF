import mongoose from "mongoose"
import docenteModel from "../models/docente.model.js"
import formatoModel from "../models/formato.model.js"
import informeModel from "../models/informe.model.js"
import periodoAcademicoModel from "../models/periodoAcademico.model.js"

const informeFinalController = {}

informeFinalController.obtenerPorPeriodo = async (req, res) => {
    if (!req.user) return res.status(404).json({ message: "No se encontró al docente" })
    const nombrePeriodo = req.params.periodo
    const id = req.user.docente
    try {
        //const docente = await docenteModel.findById(id)
        const docente = await docenteModel.findById(id)
        if (!docente) return res.status(404).json({ message: "No se pudo encontrar al docente" })
        const periodoAcademico = await periodoAcademicoModel.findOne({ nombre: nombrePeriodo })
        if (!periodoAcademico) return res.status(404).json({ message: "No se pudo encontrar el periodo académico" })
        let informe = await informeModel.findOne({ docente: docente.id, periodoAcademico: periodoAcademico.id })
        if (!informe && periodoAcademico.estado === false) return res.status(404).json({ message: "El informe final no existe" })
        if (!informe) informe = await informeModel.create({ docente: docente.id, periodoAcademico: periodoAcademico.id })
        return res.status(200).json({ message: "Se pudo obtener el informe final", informeFinal: informe })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

informeFinalController.obtenerTodosPorDocente = async (req, res) => {
    if (!req.user) return res.status(404).json({ message: "No se encontró al docente" })
    const id = req.user.docente
    try {
        const docente = await docenteModel.findById(id)
        if (!docente) return res.status(404).json({ message: "No se encontró al docente" })
        const informes = await informeModel.find({ docente: docente.id })
            .populate(['periodoAcademico', 'formato'])
            .lean()
        if (!informes) return res.status(404).json({ message: "No se pudo obtener los informes del docente" })
        console.log(informes)
        for (let i = 0; i < informes.length; i++) {
            if (informes[i].periodoAcademico == null){
                await informeModel.findByIdAndDelete(informes[i]._id)
            }
        }
        return res.status(200).json({ informes: informes })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

informeFinalController.asignarFormato = async (req, res) => {
    const id = req.params.informe
    const idFormato = req.params.formato
    if (!mongoose.isValidObjectId(idFormato)) return res.status(404).json({message: 'No se encontró el formato'})
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({message: 'No se encontró el informe final'})
    const informe = await informeModel.findById(id)
    if (!informe) return res.status(404).json({message: 'No se encontró el informe final'})
    const formato = await formatoModel.findById(idFormato)
    if (!formato) return res.status(404).json({message: 'No se encontró el formato'})
    await informe.updateOne({formato: formato.id})
    return res.status(200).json({message: 'El formato se ha asigando al informe final con éxito'})
}

export default informeFinalController
import mongoose from "mongoose"
import docenteModel from "../models/docente.model.js"
import formatoModel from "../models/formato.model.js"
import informeModel from "../models/informe.model.js"
import periodoAcademicoModel from "../models/periodoAcademico.model.js"

const informeFinalController = {}

informeFinalController.obtenerPorPeriodo = async (req, res) => {
    if (!req.user) return res.status(404).json({ message: "No se encontró al docente" })
    const periodo = req.params.periodo
    const id = req.user.docente
    try {
        //const docente = await docenteModel.findById(id)
        const docente = await docenteModel.findById(id)
        if (!docente) return res.status(404).json({ message: "No se pudo encontrar al docente" })
        const periodoAcademico = await periodoAcademicoModel.findById(periodo)
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

informeFinalController.obtenerTodosPorPeriodo = async (req, res) => {
    if (!req.user) return res.status(404).json({ message: "No se encontró al docente" })
    const idPeriodo = req.params.periodo
    try {
        const periodoAcademico = await periodoAcademicoModel.findById(idPeriodo)
        if (!periodoAcademico) return res.status(404).json({ message: "No se pudo encontrar el periodo académico" })
        const informes = await informeModel.find({ periodoAcademico: idPeriodo }).populate('docente')
        return res.status(200).json({ informes })
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
        const informes = await informeModel.find({ docente: docente.id}).sort({ created_at: 'desc' })
            .populate(['periodoAcademico'])
            .lean()
        if (!informes) return res.status(404).json({ message: "No se pudo obtener los informes del docente" })
        console.log(informes)
        for (const informe of informes) {
            if (informe.periodoAcademico == null) {
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
    if (!mongoose.isValidObjectId(idFormato)) return res.status(404).json({ message: 'No se encontró el formato' })
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'No se encontró el informe final' })
    const informe = await informeModel.findById(id)
    if (!informe) return res.status(404).json({ message: 'No se encontró el informe final' })
    const formato = await formatoModel.findById(idFormato)
    if (!formato) return res.status(404).json({ message: 'No se encontró el formato' })
    await informe.updateOne({ formato: formato.id })
    return res.status(200).json({ message: 'El formato se ha asigando al informe final con éxito' })
}

informeFinalController.guardarInformeFirmaDocente = async (req, res) => {
    if (!req.file) return res.status(404).json({ message: 'Debe proporcionar un documento' });
    if (!req.body.firmado_por) return res.status(404).json({ message: "Proporcione si firmado_por es por 'docente' o 'director'"})
    if (req.body.firmado_por == 'docente') {
        console.log(req.periodo._id.toString())
        const informe = await informeModel.findOne({ docente: req.user.docente, periodoAcademico: req.periodo._id.toString() });
        await informe.updateOne({ documento_firma_docente: req.periodo.nombre + '/' + req.nombreDocumento, estado: 'enviadoFirmar'})
    } else if (req.body.firmado_por == 'director'){
        const informe = await informeModel.findOne({ docente: req.body.docente, periodoAcademico: req.periodo._id.toString() })
        await informe.updateOne({ documento_firma_director: req.periodo.nombre + '/' + req.nombreDocumento, estado: 'completado' })
    }
    return res.status(200).json({ message: 'Informe final guardado con éxito' })
}


informeFinalController.cambiarEstado = async (req, res) => {
    const idInforme = req.params.informe
    if (!mongoose.isValidObjectId(idInforme)) return res.status(404).json({message: 'No se encontró el informe final'})
    const informe = await informeModel.findById(idInforme)
    if (!informe) return res.status(404).json({message: 'No se encontró el informe final'})
    await informe.updateOne({estado: req.body.estado})
    return res.status(200).json({ message: 'Ha cambiado el estado de informe' })
}


export default informeFinalController
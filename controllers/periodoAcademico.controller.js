import mongoose from "mongoose"
import informeModel from "../models/informe.model.js"
import periodoAcademicoModel from "../models/periodoAcademico.model.js"

const periodoAcademicoController = {}

periodoAcademicoController.crear = async (req, res) => {
    const periodo = req.body.periodo
    const cambiarEstado = await cambiarEstadoUltimoPeriodo()
    if (cambiarEstado == "error") return res.status(404).json({ message: "Ocurrió un error al crear el nuevo periodo académico" })
    const periodoAcademico = await periodoAcademicoModel.create(periodo)
    if (!periodoAcademico) return res.status(404).json({ message: "Ocurrió un error al crear el nuevo periodo académico" })
    return res.status(200).json({ message: "Se creó con éxito un nuevo periodo académico" })
}

periodoAcademicoController.obtenerTodos = async (req, res) => {
    let periodos = await periodoAcademicoModel.find().sort({ created_at: -1 }).lean()
    if (!periodos) return res.status(404).json({ message: "Ocurrió un error al obtener todos los periodos académicos" })
    for (let i = 0; i < periodos.length; i++) {
        periodos[i].editable = true
        const informes = await informeModel.find({ periodoAcademico: periodos[i]._id })
        if (informes.length && informes.length > 0) periodos[i].editable = false
    }
    return res.status(200).json({ message: "Se obtuvo todos los periodos académicos", periodos: periodos })
}

periodoAcademicoController.obtenerActivo = async (req, res) => {
    const periodo = await periodoAcademicoModel.findOne({ estado: true })
    if (!periodo) return res.status(404).json({ message: "No existe un periodo académico activo" })
    return res.status(200).json({ message: "Se obtuvo el periodo académico activo", periodo: periodo })
}

periodoAcademicoController.eliminar = async (req, res) => {
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: "No existe el periodo académico" })
    const periodo = await periodoAcademicoModel.findById(id)
    const informes = await informeModel.find({ periodoAcademico: periodo._id })
    if (informes.length && informes.length > 0) return res.status(404).json({ message: "No se puede eliminar el periodo académico" })
    if (!periodo) return res.status(404).json({ message: "No existe el periodo académico" })
    await periodo.delete()
    return res.status(200).json({ message: "Periodo eliminado con éxito" })
}

const cambiarEstadoUltimoPeriodo = async () => {
    try {
        const periodo = await periodoAcademicoModel.findOne({ estado: true })
        if (periodo) {
            const data = { estado: false }
            if (!periodo.fechaFin) data.fechaFin = new Date()
            await periodo.updateOne(data)
        }
        return "success"
    } catch (error) {
        console.log(error)
        return "error"
    }
}

export default periodoAcademicoController
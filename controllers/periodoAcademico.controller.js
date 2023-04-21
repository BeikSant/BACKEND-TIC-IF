import mongoose from "mongoose"
import informeModel from "../models/informe.model.js"
import periodoAcademicoModel from "../models/periodoAcademico.model.js"

const periodoAcademicoController = {}

periodoAcademicoController.crear = async (req, res) => {
    const periodo = {
        nombre: req.body.periodo.nombre.toString(),
        fechaInicio: new Date(req.body.periodo.fechaInicio),
        fechaFin: req.body.periodo.fechaFin != '' ? new Date(req.body.periodo.fechaFin) : ''
    }
    const cambiarEstado = await cambiarEstadoUltimoPeriodo()
    if (cambiarEstado == "error") return res.status(404).json({ message: "Ocurrió un error al crear el nuevo periodo académico" })
    const periodoAcademico = await periodoAcademicoModel.create(periodo)
    if (!periodoAcademico) return res.status(404).json({ message: "Ocurrió un error al crear el nuevo periodo académico" })
    return res.status(200).json({ message: "Se creó con éxito un nuevo periodo académico" })
}

periodoAcademicoController.obtenerTodos = async (req, res) => {
    let periodos = await periodoAcademicoModel.find().sort({ created_at: -1 }).lean()
    if (!periodos) return res.status(404).json({ message: "Ocurrió un error al obtener todos los periodos académicos" })
    for (let periodo of periodos) {
        periodo.editable = true
        const informes = await informeModel.find({ periodoAcademico: periodo._id })
        if (informes.length && informes.length > 0) periodo.editable = false
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

periodoAcademicoController.editar = async (req, res) => {
    const periodoBody = req.body
    const idperiodo = req.params.id
    console.log(idperiodo)
    if (!mongoose.isValidObjectId(idperiodo)) return res.status(404).json({message: "No existe el periodo académico"})
    const periodo = await periodoAcademicoModel.findById(idperiodo)
    if (!periodo) return res.status(404).json({message: "No existe el periodo académico"})
    if (!periodo.estado)  return res.status(404).json({message: "No se puede editar el periodo académico"})
    await periodo.updateOne(periodoBody)
    return res.status(200).json({message: "Periodo académico editado con éxito"})
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
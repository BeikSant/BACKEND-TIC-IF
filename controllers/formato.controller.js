import mongoose from "mongoose"
import formatoModel from "../models/formato.model.js"
import informeModel from "../models/informe.model.js"
import periodoAcademicoModel from "../models/periodoAcademico.model.js"

const formatoController = {}

formatoController.obtenerPorDefecto = async (req, res) => {
    const formato = await formatoModel.findOne({ tipo: 'POR DEFECTO' })
    return res.status(200).json({ formato: formato })
}

formatoController.obtenerUno = async(req, res) => {
    const id = req.params.formato
    console.log(id)
    const formato = await formatoModel.findById(id)
    if (!formato) res.status(404).json({message: 'No se encontró el formato' })
    return res.status(200).json(formato)
}

formatoController.crear = async (req, res) => {
    if (!req.body.formato) return res.status(404).json({ message: "No existen un formato para registrar" })
    const formatoActual = await formatoModel.findOne({ estado: true })
    if (formatoActual != null) await formatoActual.updateOne({ estado: false }) 
    const formatoNuevo = await formatoModel.create(req.body.formato)
    if (!formatoNuevo) return res.status(404).json({ message: "Ocurrio un error al crear el formato" })
    return res.status(200).json({ message: 'El formato del informe final se ha creado con exito' })
}

formatoController.obtenerTodos = async (req, res) => {
    let formatos = await formatoModel.find().lean()
    if (!formatos) return res.status(404).json({ message: "No existen formatos registrados" })
    for (let i = 0; i < formatos.length; i++) {
        formatos[i].editable = true
        const informes = await informeModel.find({formato: formatos[i]._id}).populate('periodoAcademico').sort({created_at: 1}).lean()
        if (informes.length && informes.length > 0) {
            for (let j = 0; j < informes.length; j++) {
                if (!informes[j].periodoAcademico.estado){
                    formatos[i].editable = false
                }
            }
        }
    }
    return res.status(200).json({ formatos: formatos })
}

formatoController.actualizar = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "No se encontró el formato" })
    if (!req.body.formato) return res.status(404).json({ message: "No existen un formato para registrar" })
    const formato = await formatoModel.findById(req.params.id)
    if (!formato) return res.status(404).json({ message: "No se encontró el formato" })
    const informes = await informeModel.find({formato: formato._id}).populate('periodoAcademico').sort({created_at: 1}).lean()
    if (informes.length && informes.length > 0) {
        for (let j = 0; j < informes.length; j++) {
            if (!informes[j].periodoAcademico.estado){
                return res.status(404).json({message: 'Este formato no se puede editar'})
            }
        }
    }
    await formato.updateOne(req.body.formato)
    return res.status(200).json({ message: 'El formato se ha actualizó con exito' })
}

formatoController.cambiarEstado = async (req, res) => {
    const formatoActual = await formatoModel.findOne({ estado: true })
    if (formatoActual != null) await formatoActual.updateOne({ estado: false }) 
    const formatoNuevo = await formatoModel.findById(req.params.id)
    if (!formatoNuevo) return res.status(404).json({ message: 'No se pudo encontrar el formato' })
    await formatoNuevo.update({ estado: true })
    return res.status(200).json({ message: 'Se ha actualizado con exito el formato del informe final' })
}

formatoController.obtenerActivo = async (req, res) => {
    try {
        const formato = await formatoModel.findOne({ estado: true })
        if (!formato) return res.status(404).json({ message: "No existe un formato activo o disponible" })
        return res.status(200).json(formato)
    } catch (error) {
        console.log(error)
        return res.status(500).message({ message: "Error interno del servidor" })
    }
}

formatoController.eliminar = async (req, res) => {
    const idformato = req.params.id
    if (!mongoose.isValidObjectId(idformato)) return res.status(404).json({message: 'Formato no encontrado'})
    const formato = await formatoModel.findById(idformato)
    const informes = await informeModel.find({formato: formato._id}).populate('periodoAcademico').sort({created_at: 1}).lean()
    if (formato.estado) return res.status(404).json({message: 'Este formato no se puede eliminar'})
    if (informes.length && informes.length > 0) {
        for (let j = 0; j < informes.length; j++) {
            if (!informes[j].periodoAcademico.estado){
                return res.status(404).json({message: 'Este formato no se puede eliminar'})
            }
        }
    }
    await formato.delete()
    return res.status(200).json({message: 'Formato eliminado con éxito'})
}
 
export default formatoController
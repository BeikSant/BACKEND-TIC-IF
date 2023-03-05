import mongoose from "mongoose";
import carreraModel from "../models/carrera.model.js";
import facultadModel from "../models/facultad.model.js";
import docenteModel from "../models/docente.model.js";
import usuarioModel from "../models/usuario.model.js";
import rolModel from "../models/rol.model.js";

const docenteController = {}

docenteController.obtener = async (req, res) => {
    if (!req.user) return res.status(404).json({ message: "No se encontró al docente" })
    try {
        const docente = await docenteModel.findById(req.user.docente)
            .populate({
                path: 'carrera',
                populate: {
                    path: 'facultad',
                }
            })
        if (!docente) return res.status(404).json({ message: "No se encontró al docente" })
        return res.status(200).json({ docente })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

docenteController.guardar = async (req, res) => {
    const docente = req.body;
    const doc = await docenteModel.create(docente);
    if (!doc) return res.status(404).json({ message: 'Error al crear al docente' })
    const rol = await rolModel.findOne({ nombre: req.body.rol });
    if (!rol) return res.status(404).json({ message: 'No se pudo encontrar el rol' })
    console.log(doc)
    const usuario = await usuarioModel.create({
        username: doc.correo,
        password: doc.cedula,
        docente: doc.id,
        rol: rol.id,
    })
    return res.status(200).json({ message: 'Docente creado con éxito', docente: docente, usuario: usuario })
}

docenteController.obtenerTodos = async (req, res) => {
    const user = await usuarioModel.find().populate({
        path: 'docente',
        populate: {
            path: 'carrera',
        }
    })
    return res.status(200).json(user)
}

docenteController.eliminar = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'No existe el docente' })
    const docente = await docenteModel.findById(req.params.id)
    if (!docente) return res.status(404).json({ message: 'No existe el docente' })
    await docente.delete()
    return res.status(200).json({ message: 'Docente eliminado' })
}

docenteController.editar = async (req, res) => {
    const idDocente = req.params.id
    if (!mongoose.isValidObjectId(idDocente)) return res.status(404).json({ message: "No se encontró al docente" })
    const docente = req.body
    if (!docente) return res.status(404).json({ message: 'No existen campos a actualizar' })
    try {
        const docenteFind = await docenteModel.findById(idDocente)
        if (!docenteFind) return res.status(404).json({ message: "No se encontró al docente" })
        await docenteFind.updateOne(docente)
        const user = await await usuarioModel.findOne({docente: docenteFind.id})
        if (!user) return res.status(404).json({ message: "No se puedo modificar la cuenta del docente"})
        user.username = docente.correo
        await user.save()
        return res.status(200).json({ message: 'Se actualizó la información del docente' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }

}

export default docenteController;
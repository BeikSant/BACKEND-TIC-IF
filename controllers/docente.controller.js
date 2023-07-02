import mongoose from "mongoose";
import docenteModel from "../models/docente.model.js";
import usuarioModel from "../models/usuario.model.js";
import rolModel from "../models/rol.model.js";
const docenteController = {}
//Permite obtener todos los docetes de la base de datos
docenteController.obtenerTodos = async (req, res) => {
    const iddocente = req.user.docente
    const rol = req.user.rol
    const docente = await docenteModel.findById(iddocente)
    let filter = {}
    if (rol == 'director') filter = { carrera: docente.carrera }
    let docentes = await docenteModel.find(filter).populate(['carrera', {
        path: 'usuario',
        populate: {
            path: 'rol',
        }
    }]).lean()
    for (let d of docentes) {
        if (d.correo == docente.correo) {
            d.isActual = true
            break;
        }
    }
    return res.status(200).json(docentes)
}

//Permite obtener un docente por su id de la base de datos
docenteController.obtenerUno = async (req, res) => {
    if (!req.user) return res.status(404).json({ message: "No se encontró al docente" })
    try {
        const docente = await docenteModel.findById(req.user.docente)
            .populate({
                path: 'usuario',
                populate: {
                    path: 'rol',
                }
            })
        if (!docente) return res.status(404).json({ message: "No se encontró al docente" })
        return res.status(200).json({ docente })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

//Permite crear un docente en la base de datos
docenteController.crear = async (req, res) => {
    try {
        let docente = {
            primerNombre: req.body.primerNombre.toString(),
            segundoNombre: req.body.segundoNombre.toString(),
            primerApellido: req.body.primerApellido.toString(),
            segundoApellido: req.body.segundoApellido.toString(),
            correo: req.body.correo.toString(),
            dedicacion: req.body.dedicacion.toString(),
        }
        console.log(docente)
        if ((await docenteModel.find({ correo: docente.correo })).length > 0) return res.status(404).json({ message: 'El correo ya pertenece a otro docente' })
        const iddirector = req.user.docente
        //Obtiendo la carrera del director
        const director = await docenteModel.findById(iddirector)
        //Asignando la carrera del director al docente
        docente.carrera = director.carrera
        const rol = await rolModel.findOne({ nombre: 'docente' });
        const doc = await docenteModel.create(docente)
        const usuario = await usuarioModel.create({
            username: doc.correo,
            password: doc.primerNombre + '.' + doc.primerApellido + '@' + 'Docente',
            rol: rol._id,
        })
        if (!usuario) {
            await doc.delete()
            return res.status(404).json({ message: 'Ocurrió un error al crear al docente' })
        }
        doc.usuario = usuario._id
        await doc.save()
        await doc.populate({
            path: 'usuario',
            populate: {
                path: 'rol',
            }
        })
        return res.status(200).json({ message: 'Docente creado con éxito', docente: doc })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: 'Ocurrió un error al crear al docente' })
    }
}

//Permite editar la informacion de un docente
docenteController.editar = async (req, res) => {
    const idDocente = req.params.id
    if (!mongoose.isValidObjectId(idDocente)) return res.status(404).json({ message: "No se encontró al docente" })
    const docente = req.body
    try {
        const docenteFind = await docenteModel.findById(idDocente)
        if (!docenteFind) return res.status(404).json({ message: "No se encontró al docente" })
        await docenteFind.updateOne(docente)
        const docenteUpdt = await docenteModel.findById(idDocente)
            .populate({
                path: 'usuario',
                populate: {
                    path: 'rol',
                }
            })
        console.log(docenteUpdt)
        return res.status(200).json({ message: 'Información del docente actualizada con éxito', docente: docenteUpdt })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }

}

docenteController.editarDedicacion = async (req, res) => {
    const idDocente = req.params.id
    if (!mongoose.isValidObjectId(idDocente)) return res.status(404).json({ message: "No se encontró al docente" })
    const dedicacion = req.body.dedicacion
    if (!dedicacion) return res.status(404).json({ message: 'No existe la dedicación, comuníquese con el administrador' })
    try {
        const docenteFind = await docenteModel.findById(idDocente)
        if (!docenteFind) return res.status(404).json({ message: "No se encontró al docente, comuníquese con el administrador" })
        await docenteFind.updateOne({ dedicacion })
        return res.status(200).json({ message: 'Se actualizó con éxito su dedicación' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

export default docenteController;
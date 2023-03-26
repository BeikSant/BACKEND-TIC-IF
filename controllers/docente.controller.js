import mongoose from "mongoose";
import "../models/carrera.model.js";
import "../models/facultad.model.js";
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
    for (let i = 0; i < docentes.length; i++) {
        console.log(docentes[i].cedula, docente.cedula)
        if (docentes[i].cedula == docente.cedula) {
            console.log("IsIgual")
            docentes[i].isActual = true
            i = docentes.length + 1
        }
    }
    return res.status(200).json(docentes)
}

//Permite obtener un docente por su cedula de la base de datos
docenteController.obtenerUno = async (req, res) => {
    if (!req.user) return res.status(404).json({ message: "No se encontró al docente" })
    try {
        const docente = await docenteModel.findById(req.user.docente)
            .populate([{
                path: 'carrera',
                populate: {
                    path: 'facultad',
                }
            }, {
                path: 'usuario',
                populate: {
                    path: 'rol',
                }
            }])
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
        let docente = req.body;
        console.log(docente)
        if ((await docenteModel.find({ correo: docente.correo })).length > 0) return res.status(404).json({ message: 'El correo electrónico pertenece a otro docente' })
        if ((await docenteModel.find({ cedula: docente.cedula })).length > 0) return res.status(404).json({ message: 'La cedula ya pertenece a otro docente' })
        const iddirector = req.user.docente
        //Obtiendo la carrera del director
        const director = await docenteModel.findById(iddirector)
        //Asignando la carrera del director al docente
        docente.carrera = director.carrera
        const rol = await rolModel.findOne({ nombre: 'docente' });
        const doc = await docenteModel.create(docente);
        const usuario = await usuarioModel.create({
            username: doc.correo,
            password: doc.cedula,
            rol: rol._id,
        })
        if (!usuario) {
            await doc.delete()
            return res.status(404).json({ message: 'Ocurrió un error al crear al docente' })
        }
        doc.usuario = usuario._id
        await doc.save()
        return res.status(200).json({ message: 'Docente creado con éxito', docente: docente, usuario: usuario })
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
    if (!docente) return res.status(404).json({ message: 'No existen campos a actualizar' })
    try {
        const docenteFind = await docenteModel.findById(idDocente)
        if (!docenteFind) return res.status(404).json({ message: "No se encontró al docente" })
        await docenteFind.updateOne(docente)
        const user = await await usuarioModel.findById(docenteFind.usuario)
        if (!user) return res.status(404).json({ message: "No se puedo modificar la cuenta del docente" })
        user.username = docente.correo
        await user.save()
        return res.status(200).json({ message: 'Se actualizó la información del docente' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }

}

export default docenteController;
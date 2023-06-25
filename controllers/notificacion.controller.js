
import docenteModel from "../models/docente.model.js"
import notificacionModel from "../models/notificacion.model.js"
import { io } from "../utils/socket.js"

export default {
    async guardarNotificacion(req, res) {
        let notificacion = {
            origen: req.user.docente,
            destino: req.body.destino ? String(req.body.destino) : null, //Este solo es diferente de null cuando va de un docente al director
            mensaje: String(req.body.mensaje),
        }
        let destinos = []//En caso de haber notificacion para multiples usuarios
        const docentes = await docenteModel.find().populate({
            path: 'usuario',
            populate: {
                path: 'rol',
            }
        }).lean()
        let notificacionSave = null
        if (notificacion.destino == null) {
            for (const docente of docentes) {
                if (docente.usuario.rol.nombre.toLowerCase() == 'director') {
                    notificacion.destino = docente._id
                    destinos.push(docente._id)
                    notificacionSave = await notificacionModel.create(notificacion)
                }
            }
        } else {
            notificacionSave = await notificacionModel.create(notificacion)
        }
        notificacionSave = notificacionSave.populate('origen')
        io.emit('notificacion', { ...(await notificacionSave).toJSON(), destinos })
        return res.status(200).json({ message: "La notificación se ha enviado con éxito", notificacionSave })
    },

    async obtenerTodasPorDocente(req, res) {
        const idDocente = req.user.docente
        const page = Number(req.params.page)
        const perPage = Number(req.params.perPage)

        const notificaciones = await notificacionModel
            .find({ destino: idDocente })
            .populate('origen')
            .sort({ created_at: 'desc' })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .exec()
            
        const pages =  Math.ceil(await notificacionModel.count({ destino: idDocente }) / perPage)
        return res.status(200).json({ notificaciones, pages, page, perPage })
    },

    async obtenerNoLeidos(req, res) {
        const idDocente = req.user.docente
        const fechaActual = new Date();
        fechaActual.setHours(fechaActual.getHours() - 1); // Fecha hace 12 horas
        const notificaciones = await notificacionModel.find({
            destino: idDocente,
            $or: [
                { leido: false },
                { leido: true, updated_at: { $gte: fechaActual } }
            ]
        })
            .populate('origen').sort({ created_at: 'desc' }).lean()
        return res.status(200).json({ notificaciones })
    },

    async leeNotificacion(req, res) {
        const idNotificacion = req.params.id
        const notificacion = await notificacionModel.findById(idNotificacion)
        if (!notificacion) return res.status(404).message({ message: "No se encontro la notificacion" })
        await notificacion.updateOne({ leido: true })
        return res.status(200).json({ message: "Notificación leída" })
    }
}
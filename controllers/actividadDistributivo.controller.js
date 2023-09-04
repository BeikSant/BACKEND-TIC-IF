import actividadDistributivoModel from "../models/actividadDistributivo.model.js"
import funcionSustantivaModel from "../models/funcionSustantiva.model.js"

export default {

    //obtiene todas las actividades del distributivo activas con su respectiva funcion sustantiva
    obtenerActivas: async (_, res) => {
        const funcionesSustantivas = await funcionSustantivaModel.find()
        if (funcionesSustantivas == []) return res.status(404).json({ message: "No existen actividades del distributivo registradas" })
        let result = { funcionesSustantivas: [] }
        for (let fs of funcionesSustantivas) {
            const actividades = await actividadDistributivoModel.find({ estado: true, funcionSustantiva: fs.id })
            if (actividades.length > 0) {
                const resultado = { nombre: fs.nombre, _id: fs._id, actividadesDistributivo: actividades }
                result.funcionesSustantivas.push(resultado)
            }
        }
        return res.status(200).json({ message: "Se ha obtenido las actividades con éxito", actividades: result })
    },

    obtenerPorFuncion: async (req, res) => {
        const fs = req.params.id
        const actividades = await actividadDistributivoModel.find({ funcionSustantiva: fs })
        return res.status(200).json({ message: "Se ha obtenido las actividades con éxito", actividades })
    },

    //Permite guardar actividades del distributivo de un conjunto de funciones sustantivas
    guardarTodos: async (req, res) => {
        const resCambiarEstado = await cambiarEstado()
        if (resCambiarEstado == "error") res.status(404).json({ message: "Ocurrio un error al cambiar el estado de las actividades" })
        const fsWithActividades = req.body.actividades
        let actividadesNoGuardadas = {}
        for (let fs of fsWithActividades) {
            let funcionSustantiva = await funcionSustantivaModel.findOne({ nombre: fs.nombre.toString() })
            if (!funcionSustantiva) {
                funcionSustantiva = await funcionSustantivaModel.create({ nombre: fs.nombre.toString() })
            }
            for (let ad of fs.actividadesDistributivo) {
                const data = {
                    sigla: ad.sigla.toString(),
                    descripcion: ad.descripcion.toString(),
                    funcionSustantiva: funcionSustantiva.id
                }
                const actiDis = await actividadDistributivoModel.create(data)
                if (!actiDis) {
                    actividadesNoGuardadas.push(ad)
                }
            }
        }
        return res.status(200).json({
            message: "Se han guardado las nuevas actividades del distribuvo con éxito",
            error_guardar_actividades: actividadesNoGuardadas
        })
    },

}

const cambiarEstado = async () => {
    const actividades = await actividadDistributivoModel.find({ estado: true })
    if (!actividades) return "error"
    for (let actividad of actividades) {
        await actividad.updateOne({ estado: false })
    }
    return "success"
}
import actividadDistributivoModel from "../models/actividadDistributivo.model.js"
import funcionSustantivaModel from "../models/funcionSustantiva.model.js"

const actividadDistributivoController = {}

//obtiene todas las actividades del distributivo activas con su respectiva funcion sustantiva
actividadDistributivoController.obtenerActivas = async (req, res) => {
    const funcionesSustantivas = await funcionSustantivaModel.find()
    if (funcionesSustantivas == []) return res.status(404).json({ message: "No existen actividades del distributivo registradas" })
    let result = { funcionesSustantivas: [] }
    for (let i = 0; i < funcionesSustantivas.length; i++) {
        const actividades = await actividadDistributivoModel.find({ estado: true, funcionSustantiva: funcionesSustantivas[i].id })
        if (actividades.length > 0) {
            const resultado = { nombre: funcionesSustantivas[i].nombre, actividadesDistributivo: actividades }
            result.funcionesSustantivas.push(resultado)
        }
    }
    return res.status(200).json({ message: "Se ha obtenido las actividades con éxito", actividades: result })
}

actividadDistributivoController.obtenerPorFuncion = async (req, res) => {
    const fs = req.params.id
    const actividades = await actividadDistributivoModel.find({funcionSustantiva: fs })
    return res.status(200).json({ message: "Se ha obtenido las actividades con éxito", actividades })
}

//Permite guardar actividades del distributivo de un conjunto de funciones sustantivas
actividadDistributivoController.guardarTodos = async (req, res) => {
    const resCambiarEstado = await cambiarEstado()
    if (resCambiarEstado == "error") res.status(404).json({ message: "Ocurrio un error al cambiar el estado de las actividades" })
    const actividades = req.body.actividades
    console.log(actividades)
    let actividadesNoGuardadas = {}
    for (let i = 0; i < actividades.length; i++) {
        let funcionSustantiva = await funcionSustantivaModel.findOne({ nombre: actividades[i].nombre })
        if (!funcionSustantiva) {
            funcionSustantiva = await funcionSustantivaModel.create({ nombre: actividades[i].nombre })
        }
        let actividadesDistributivo = actividades[i].actividadesDistributivo
        for (let j = 0; j < actividadesDistributivo.length; j++) {
            actividadesDistributivo[j].funcionSustantiva = funcionSustantiva.id
            const actiDis = await actividadDistributivoModel.create(actividadesDistributivo[j])
            console.log(actiDis)
            if (!actiDis) {
                console.log("No se guardo una actividad del distributivo docente")
                actividadesNoGuardadas.push(actividadesDistributivo[j])
            }
        }
    }
    return res.status(200).json({
        message: "Se han guardado las nuevas actividades del distribuvo con exito",
        error_guardar_actividades: actividadesNoGuardadas
    })
}

//Permite guardar una actividad del distributivo en caso de no haberse guardado una actividad en la funcion guardarTodos
actividadDistributivoController.guardarUno = async (req, res) => {
    const actividad = req.body.actividad
    let funcionSustantiva = await funcionSustantivaModel.findOne({ nombre: actividad.funcionSustantiva.nombre })
    if (!funcionSustantiva) return res.status(404).json({ message: "No existe la funcion sustantiva" })
    actividad.funcionSustantiva.actividadDistributivo.funcionSustantiva = funcionSustantiva.id
    const actiDis = await actividadDistributivoModel.create(actividad.funcionSustantiva.actividadDistributivo)
    if (!actiDis) return res.status(404).json({ message: "No se ha podido guardar la actividad del distributivo" })
    return res.status(200).json({ message: "Se ha guardado la actividad del distributivo con éxito" })
}

//cambiar el estado de las actividades del distributivo actuales
const cambiarEstado = async () => {
    const actividades = await actividadDistributivoModel.find({ estado: true })
    console.log(actividades)
    if (!actividades) return "error"
    for (let i = 0; i < actividades.length; i++) {
        await actividades[i].update({ estado: false })
    }
    return "success"
}


export default actividadDistributivoController
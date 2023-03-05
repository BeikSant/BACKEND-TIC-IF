import carreraModel from "../models/carrera.model.js"

const carreraController = {}

carreraController.obtenerTodos = async (req, res) => {
    const carreras = await carreraModel.find()
    if (!carreras) return res.status(404).json({message: 'No se pudo obtener las carreras'})
    return res.status(200).json({carreras})
}

export default carreraController
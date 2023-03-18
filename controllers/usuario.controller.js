import mongoose from 'mongoose'
import docenteModel from '../models/docente.model.js'
import rolModel from '../models/rol.model.js'
import { nanoid } from 'nanoid'
import usuarioModel from '../models/usuario.model.js'
import { generateToken } from '../utils/tokens.js'
import mail from '../utils/mail.js'

const usuarioController = {}

usuarioController.login = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await usuarioModel.findOne({ username: username }).populate('rol')
        if (!user) return res.status(404).json({ message: 'Credenciales incorrectas' })
        const docente = await docenteModel.findOne({ usuario: user._id })
        const comparePassword = await user.comparePassword(password)
        if (!comparePassword) return res.status(404).json({ message: 'Credenciales incorrectas' })
        if (!user.estado) return res.status(404).json({ message: 'La cuenta se encuentra inactiva' })
       
        const fechaExpire = new Date();
        //fechaExpire.setSeconds(fechaExpire.getSeconds() + 10);
        fechaExpire.setHours(fechaExpire.getHours() + 12);

        const dataUser = {
            user: user.id,
            docente: docente.id,
            rol: user.rol.nombre,
            expireToken: fechaExpire
        }
        const { token } = generateToken(dataUser)
        return res.status(200).json({ token })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}


usuarioController.verificarsesion = async (req, res) => {
    const rol = req.user.rol
    return res.status(200).json({message: "OK", rol: rol})
}

usuarioController.updatePassword = async (req, res) => {
    //return res.status(200).json({ message: "Se actualizó la contraseña con éxito" })
    const password = req.body.password
    const newpassword = req.body.new_password
    const iduser = req.user.user
    if (!mongoose.isValidObjectId(iduser)) return res.status(404).json({ message: "Usuario no registrado" })
    if (!password) return res.status(404).json({ message: 'No existe la contraseña actual' })
    if (!newpassword) return res.status(404).json({ message: 'No existe la nueva contraseña' })

    try {
        const user = await usuarioModel.findById(iduser)
        if (!user) return res.status(404).json({ message: "Usuario no registrado" })
        const comparePassword = await user.comparePassword(password)
        if (!comparePassword) return res.status(404).json({ message: "La contraseña actual es incorrecta" })
        user.password = newpassword
        await user.save()
        return res.status(200).json({ message: "La contraseña se actualizó con éxito" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

usuarioController.generarTokenRecuperacion = async (req, res) => {
    const email = req.params.email
    let enlace = req.body.enlace
    try {
        const user = await usuarioModel.findOne({ username: email })
        if (!user) return res.status(404).json({ message: "El correo no pertence a ninguna cuenta registrada" })
        if (!user.estado) return res.status(404).json({ message: 'La cuenta se encuentra inactiva, comuníquese con el Director' })
        if (user.tokenRecuperacion && user.tokenRecuperacion != null) {
            if (new Date() < new Date(user.tokenExpire)) return res.status(200).json({ message: "El email ya ha sido enviado a su correo" })
            user.tokenRecuperacion = null
            user.tokenExpire = null
        }
        //console.log(user.tokenRecuperacion && user.tokenRecuperacion != null ? true : false)
        const token = nanoid(50)
        const fechaExpire = new Date();
        fechaExpire.setHours(fechaExpire.getHours() + 1);
        //enviar email
        user.tokenRecuperacion = token
        user.tokenExpire = fechaExpire
        const enviarEmail = await mail.enviarMail(user.username, enlace + '/' + user.tokenRecuperacion)
        if (enviarEmail == 'error') res.status(404).json({ message: "Error al enviar el correo" })
        await user.save()
        return res.status(201).json({ message: "Email enviado a su correo" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

usuarioController.verifyToken = async (req, res) => {
    const token = req.params.token
    try {
        const user = await usuarioModel.findOne({ tokenRecuperacion: token })
        if (!user) return res.status(404).json({ message: "Not Found" })
        if (!user.estado) return res.status(404).json({ message: 'La cuenta se encuentra inactiva, comuníquese con el Director' })
        if (new Date() < new Date(user.tokenExpire)) return res.status(200).json({ message: "OK" })
        user.tokenRecuperacion = null
        user.tokenExpire = null
        await user.save()
        return res.status(404).json({ message: "Not Found" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

usuarioController.recuperarPassword = async (req, res) => {
    const token = req.params.token
    const newpassword = req.body.password
    try {
        const user = await usuarioModel.findOne({ tokenRecuperacion: token })
        if (!user) return res.status(404).json({ message: "Not Found" })
        user.tokenRecuperacion = null
        user.tokenExpire = null
        user.password = newpassword
        await user.save()
        res.status(200).json({ message: "Contraseña actualizada con éxito" })
    } catch (error) {
        console.log(err)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

usuarioController.cambiarEstado = async (req, res) => {
    const cedula = req.params.docente
    try {
        const docente = await docenteModel.findOne({ cedula: cedula })
        if (!docente) return res.status(404).json({ message: "No se encontró al docente" })
        const usuario = await usuarioModel.findById(docente.usuario)
        if (!usuario) return res.status(404).json({ message: "No se encontró la cuenta" })
        const estado = usuario.estado
        await usuario.updateOne({ estado: !estado })
        if (estado) return res.status(200).json({ message: "Se ha inactivado la cuenta del docente con éxito" })
        return res.status(200).json({ message: "Se ha activado la cuenta del docente con éxito" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

usuarioController.cambiarRol = async (req, res) => {
    const iddocente = req.params.docente
    const newrol = req.body.newrol
    const docente = await docenteModel.findById(iddocente)
    if (!docente) return res.status(404).json({ message: "No se encontró al docente" })
    const usuario = await usuarioModel.findById(docente.usuario)
    if (!usuario) return res.status(404).json({ message: "No se encontró la cuenta" })
    const rol = await rolModel.findOne({nombre: newrol})
    usuario.rol = rol._id
    await usuario.save()
    return res.status(200).json({message: 'Se ha cambiado el rol del docente con éxito'})
}

export default usuarioController;
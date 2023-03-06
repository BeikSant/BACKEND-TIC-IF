import nodemailer from 'nodemailer'

export default {
    async enviarMail (email, ruta){
        console.log(ruta)
        const config = {
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: USER_MAIL,
                pass: PASS_MAIL
            }
        }
    
        const mensaje = {
            from: 'santorumbeiker069@gmail.com',
            to: email,
            subject: 'Recuperación de la cuenta',
            html: `<h3>Sistema de Gestión del Informe Final de Cumplimiento del Trabajo Académico</h3>
            <p>El siguiente enlace tiene una duración de 1 hora para recuperar su cuenta, caso contrario debe generar un nuevo enlace.</p>
            <p style="">Ingrese al siguiente enlace para recuperar su cuenta: <b><a href="${ruta}" target="_blank">¡Click Aquí!</a></b></p>`
        }
        try {
            const transport = nodemailer.createTransport(config)
            await transport.sendMail(mensaje)
            return 'success'
        } catch (error) {
            return 'error'
        }
    }
}

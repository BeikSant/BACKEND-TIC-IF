import nodemailer from 'nodemailer'

export default {
    async enviarMail (email, ruta){
        console.log(ruta)
        const config = {
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'santorumbeiker069@gmail.com',
                pass: 'wqxvuhdengvhdrvc'
            }
        }
    
        const mensaje = {
            from: 'santorumbeiker069@gmail.com',
            to: email,
            subject: 'Recuperación de la cuenta',
            html: `<h6>Ingrese al siguiente enlace para recuperar su cuenta: <b><a href="${ruta}" target="_blank">¡Click Aquí!</a></b></h6>`
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

import nodemailer from 'nodemailer'

export default {
    async enviarMail(email, ruta) {
        const config = {
            secure: true,
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.PASS_MAIL
            }
        }
        const mensaje = {
            from: process.env.USER_MAIL,
            to: email,
            subject: 'Recuperación de la cuenta',
            html: ` 
            <div class="card" style=" font-family: Arial, Helvetica, sans-serif; padding: 0px;
            margin: 20px;
            background-color: rgba(0, 0, 0, 0.05);">
                <div class="card-title" 
                style=" background-color: #000E64;
                padding: 5px;
                color: white;
                text-align: center;">
                    <h5>SISTEMA DE GESTIÓN DEL INFORME FINAL DEL CUMPLIMIENTO DEL TRABAJO ACADÉMICO DE DOCENTES
                    </h5>
                </div>
                <div class="card-content" 
                style="padding-left: 20px;
                padding-right: 20px;
                text-align: center; 
                color: black;
                padding-bottom: 5px;">
                    <p>Está intentado recuperar su cuenta. El siguiente enlace solo tiene una duración de <b>1 hora</b>, caso
                        contrario debe generar un
                        nuevo enlace.</p>
                    <p> Ingrese al siguiente enlace para recuperar su cuenta: <a href="${ruta}">¡Click Aquí!</a></p>
                </div>
            </div>`
        }
        try {
            const transport = nodemailer.createTransport(config)
            await transport.sendMail(mensaje)
            return 'success'
        } catch (error) {
            console.log(error)
            return 'error'
        }
    }
}

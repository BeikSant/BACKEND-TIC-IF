import nodemailer from "nodemailer";
import fs from "fs";
import hbs from "handlebars";

const config = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASS_MAIL,
  },
};

export default {
  async nuevaCuenta(data) {
    const emailTemplate = fs.readFileSync("./templates/newAccount.hbs", "utf8");
    const htmlToSend = hbs.compile(emailTemplate)({ ...data });
    const mensaje = {
      from: process.env.USER_MAIL,
      to: data.email,
      subject: "Registro SGIF",
      html: htmlToSend,
    };
    try {
      const transport = nodemailer.createTransport(config);
      await transport.sendMail(mensaje);
      return "success";
    } catch (error) {
      console.error(error);
      return "error";
    }
  },

  async enviarInformeDirector(data) {
    const emailTemplate = fs.readFileSync(
      "./templates/enviarDirector.hbs",
      "utf8"
    );
    const htmlToSend = hbs.compile(emailTemplate)({ ...data });
    const mensaje = {
      from: process.env.USER_MAIL,
      to: data.director.email,
      subject: "Envío del informe final",
      html: htmlToSend,
    };
    try {
      const transport = nodemailer.createTransport(config);
      await transport.sendMail(mensaje);
      return "success";
    } catch (error) {
      console.error(error);
      return "error";
    }
  },

  async enviarInformeDocente(data) {
    const emailTemplate = fs.readFileSync(
      "./templates/enviarDocente.hbs",
      "utf8"
    );
    const htmlToSend = hbs.compile(emailTemplate)({ ...data });
    const mensaje = {
      from: process.env.USER_MAIL,
      to: data.docente.email,
      subject: "Aprobación del informe final",
      html: htmlToSend,
    };
    try {
      const transport = nodemailer.createTransport(config);
      await transport.sendMail(mensaje);
      return "success";
    } catch (error) {
      console.error(error);
      return "error";
    }
  },

  async recuperarCuenta(data) {
    const emailTemplate = fs.readFileSync(
      "./templates/recuperarCuenta.hbs",
      "utf8"
    );
    const htmlToSend = hbs.compile(emailTemplate)({ ...data });
    const mensaje = {
      from: process.env.USER_MAIL,
      to: data.docente.email,
      subject: "Recuperación de la cuenta",
      html: htmlToSend,
    };
    try {
      const transport = nodemailer.createTransport(config);
      await transport.sendMail(mensaje);
      return "success";
    } catch (error) {
      console.error(error);
      return "error";
    }
  },
};

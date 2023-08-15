import { requireToken } from "../middleware/validateSesion";
import mail from "../utils/mail";
import { generateToken } from "../utils/tokens";
import jwt from "jsonwebtoken"
import { validarCorreo } from "../utils/validarCorreo";

describe("Enviar mail", () => {
  // test("Prueba de envio de email valido", async () => {
  //   expect(await mail.enviarMail("santorumbeiker068@gmail.com", "")).toBe(
  //     "success"
  //   );
  // });
});

describe('Tokens de inicio de sesion', () => {
  test("Generar y validar token con secret válido", async () => {
    const token = generateToken({})
    const data = jwt.verify(token, process.env.JWT_SECRET);
    expect(typeof data).toEqual("object");
  });

  test("Desencriptar token con secret no válido", async () => {
    const token = generateToken({})
    try {
      jwt.verify(token, "");
    } catch (error) {
      expect(error.toString()).toEqual('JsonWebTokenError: secret or public key must be provided')
    }
  });
})

describe('Validación de correos institucionales', () => {
  test('Correo válido', () => {
    const res = validarCorreo('beiker.santorum@unl.edu.ec')
    expect(res).toEqual('El correo es válido')
  })

  test('Dominio diferente a @unl.edu.ec', () => {
    const res = validarCorreo('beiker.santorum@gmail.com')
    expect(res).toEqual('El dominio del correo no pertence a la UNL')
  })

  test('Correo muy corto', () => {
    const res = validarCorreo('bs@g.com')
    expect(res).toEqual('El correo es demasiado corto')
  })

  test('Caracteres no permitidos', () => {
    const res = validarCorreo('beiker"??.santorum@gmail.com')
    expect(res).toEqual('El correo contiene caracteres no permitidos')
  })

  test('Formato no válido', () => {
    const res = validarCorreo('beikersantorumgmail.com')
    expect(res).toEqual('El formato del correo no es válido')
  })
}) 


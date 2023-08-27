import { generateToken } from "../../utils/tokens";
import jwt from "jsonwebtoken"

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
  
import { validarCorreo } from "../../utils/validarCorreo";



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


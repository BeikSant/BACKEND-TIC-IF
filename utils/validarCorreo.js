export function validarCorreo(correo) {

    // Validar que el correo tiene un formato válido
    const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    if (!formatoValido) {
      return "El formato del correo no es válido";
    }
  
    // Validar longitud mínima
    if (correo.length < 10) {
      return "El correo es demasiado corto";
    }
  
    // Validar caracteres permitidos
    const caracteresPermitidos = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correo);
    if (!caracteresPermitidos) {
      return "El correo contiene caracteres no permitidos";
    }
  
    // Validar dominio
    const dominioValido = /^[^\s@]+@unl\.edu\.ec$/.test(correo);
    if (!dominioValido) {
      return "El dominio del correo no pertence a la UNL";
    }
    
    return "El correo es válido"
  }
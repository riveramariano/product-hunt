export default function validarCrearCuenta(valores) {
    let errores = {};

    // VALIDAR EL NOMBRE
    if (!valores.nombre) {
        errores.nombre = "El Nombre es Obligatorio";
    }

    // VALIDAR EL EMAIL
    if (!valores.email) {
        errores.email = "El Email es Obligatorio";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)) {
        errores.email = "Email no Valido";
    }

    // !/^(ftp|http|https):\/\/[^ "]+$/)

    // VALIDAR EL PASSWORD
    if (!valores.password) {
        errores.password = "El Password es Obligatorio";
    } else if (valores.password.length < 6) {
        errores.password = "El Password Debe Tener 6 Caracteres"
    }

    return errores;
}
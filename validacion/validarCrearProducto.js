export default function validarCrearProducto(valores) {
    let errores = {};

    // VALIDAR EL NOMBRE
    if (!valores.nombre) {
        errores.nombre = "El Nombre es Obligatorio";
    }

    // VALIDAR LA EMPRESA
    if (!valores.empresa) {
        errores.empresa = "La Empresa es Obligatoria";
    }

    // VALIDAR LA IMAGEN

    // VALIDAR LA URL
    if (!valores.url) {
        errores.url = "La URL del Producto es Obligatoria";
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
        errores.url = "URL no Válida";
    }

    // VALIDAR LA DESCRIPCION
    if (!valores.descripcion) {
        errores.descripcion = "Agrega la Descripción de tú Producto";
    }

    return errores;
}
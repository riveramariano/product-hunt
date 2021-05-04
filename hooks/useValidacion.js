import React, { useState, useEffect } from 'react'

const useValidacion = (stateInicial, validar, func) => {

    const [valores, setValores] = useState(stateInicial);
    const [errores, setErrores] = useState({});
    const [submit, setSubmit] = useState(false);

    useEffect(() => {
        if (submit) {
            const noErrores = Object.keys(errores).length === 0;
            if (noErrores) {
                func(); // FUNCION QUE SE EJECUTA EN EL COMPONENTE
            }
            setSubmit(false);
        }
    }, [errores]);

    // FUNCION QUE SE EJECUTA CONFORME EL USUARIO ESCRIBE ALGO
    const handleChange = e => {
        setValores({
            ...valores,
            [e.target.name]: e.target.value
        })
    }

    // FUNCION QUE SE EJECUTA CUANDO EL USUARIO HACE SUBMIT
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
        setSubmit(true);
    }

    // CUANDO EL USUARIO ESCRIBE Y SE SALE DEL INPUT
    const handleBlur = () => {
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
    }

    return {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur
    };
}

export default useValidacion;
import React, { useState, useEffect } from 'react'
import firebase from '../firebase';

function useAutenticacion() {

    // STATE DE USUARIO AUTENTICADO
    const [usuario, setUsuario] = useState(null);

    // SI ALGUIEN SE LOGEA GUARDA SU SESION
    useEffect(() => {
        const unsuscribe = firebase.auth.onAuthStateChanged(user => {
            if (user) {
                setUsuario(user);
            } else {
                setUsuario(null);
            }
        });
        return () => unsuscribe();
    }, []);
    
    return usuario;
}

export default useAutenticacion;
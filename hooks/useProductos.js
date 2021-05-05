import React, { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '../firebase';

const useProductos = orden => {
    const [productos, setProductos] = useState([]); // STATE
    const { firebase } = useContext(FirebaseContext); // CONTEXT

    useEffect(() => {
        const obtenerProductos = () => {
            firebase.db.collection('productos').orderBy(orden, 'desc').
                onSnapshot(manejarSnapshot);
        }
        obtenerProductos();
    }, []);

    function manejarSnapshot(snapshot) {
        const productos = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });
        setProductos(productos);
    }

    return {
        productos
    }
}

export default useProductos;
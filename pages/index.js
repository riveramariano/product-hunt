import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/layout/Layout';
import { FirebaseContext } from '../firebase';
import DetallesProducto from '../components/layout/DetallesProducto';
import styled from '@emotion/styled';

// TUVE QUE CREAR COMPONENTES PORQUE NO LLEGABA AL STATIC/CSS

const Listado = styled.div`
    background-color: #f3f3f3;
`;

const Contenedor = styled.div`
    max-width: 1200px;
    width: 95%;
    padding: 5rem 0;
    margin: 0 auto;
`;

const Producto = styled.ul`
    background-color: #FFF;
`;

const Home = () => {

    const [productos, setProductos] = useState([]); // STATE
    const { firebase } = useContext(FirebaseContext); // CONTEXT

    useEffect(() => {
        const obtenerProductos = () => {
            firebase.db.collection('productos').orderBy('creado', 'desc').
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

    return (<div>
        <Layout>
            <Listado>
                <Contenedor>
                    <Producto>
                        {productos.map(producto => (
                            <DetallesProducto
                                key={producto.id}
                                producto={producto}
                            />
                        ))}
                    </Producto>
                </Contenedor>
            </Listado>
        </Layout>
    </div>
    )
}

export default Home;
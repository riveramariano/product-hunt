import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';
import styled from '@emotion/styled';

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

const Buscar = () => {

    const router = useRouter();
    const { query: { q } } = router;

    // TODOS LOS PRODUCTOS
    const { productos } = useProductos('creado');
    const [resultado, setResultado] = useState([]);

    useEffect(() => {
        const busqueda = q.toLowerCase();
        const filtro = productos.filter(producto => {
            return (
                producto.nombre.toLowerCase().includes(busqueda) ||
                producto.descripcion.toLowerCase().includes(busqueda)
            )
        });
        setResultado(filtro);
    }, [q, productos]);

    return (
        <div>
            <Layout>
                <Listado>
                    <Contenedor>
                        <Producto>
                            {resultado.map(producto => (
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
    );
}

export default Buscar;
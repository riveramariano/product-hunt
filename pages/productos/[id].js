import React, { Fragment, useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { Campo, InputSubmit } from '../../components/ui/Formulario';

const Boton = styled.a`
    display: block;
    font-weight: 700;
    text-transform: uppercase;
    border: 1px solid #d1d1d1;
    padding: .8rem 2rem;
    margin: 2rem auto;
    text-align: center;
    background-color: ${props => props.bgColor ? '#DA552F' : 'white'};
    color: ${props => props.bgColor ? 'white' : '#000'};

    &::last-of-type {
        margin-right: 0;
    }

    &:hover {
        cursor: pointer;
    }
`;

const ContenedorProducto = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const Contenedor = styled.div`
    max-width: 1200px;
    width: 95%;
    padding: 5rem 0;
    margin: 0 auto;
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #FFF;
    text-transform: uppercase;
    font-weight: bold;
    display: inline;
    text-align: center;
`;

const Producto = () => {

    // STATE DEL COMPONENTE
    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({});
    const [consultarDB, setConsultarDB] = useState(true);

    // ROUTING PARA OBTENER EL ID EL PRODUCTO
    const router = useRouter();
    const { query: { id } } = router;

    // CONTEXT DE FIREBASE
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if (id && consultarDB) {
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                // VALIDACION
                if (producto.exists) {
                    setProducto(producto.data());
                    setConsultarDB(false);
                } else {
                    setError(true);
                    setConsultarDB(false);
                }
            }
            obtenerProducto();
        }
    }, [id]);

    if (Object.keys(producto).length === 0 && !error) return 'Cargando...';
    const { comentarios, creado, descripcion, empresa, nombre, url, imagenUrl, votos,
        creador, haVotado } = producto;

    // ADMINISTRAR Y VALIDAR LOS VOTOS
    const votarProducto = () => {
        if (!usuario) {
            return router.push('/login');
        }

        // OBTENER Y SUMAR UN NUEVO VOTO
        const nuevoTotal = votos + 1;

        // VERIFICAR SI EL USUARIO ACTUAL HA VOTADO
        if (haVotado.includes(usuario.uid)) return;

        // GUARDAR EL ID DEL USUARIO QUE HA VOTADO
        const nuevoHaVotado = [...haVotado, usuario.uid];

        // ACTUALIZAR EN LA BD
        firebase.db.collection('productos').doc(id).update({
            votos: nuevoTotal,
            haVotado: nuevoHaVotado
        });

        // ACTUALIZAR EL STATE
        setProducto({
            ...producto,
            votos: nuevoTotal
        });

        setConsultarDB(true); // HAY UN VOTO => CONSULTAR DB
    }

    // FUNCIONES PARA CREAR COMENTARIOS
    const comentarioChange = e => {
        setComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    // IDENTIFICA SI EL COMENTARIO ES DEL CREADOR DEL PRODUCTO
    const esCreador = id => {
        if (creador.id === id) {
            return true;
        }
    }

    const agregarComentario = e => {
        e.preventDefault();
        if (!usuario) {
            return router.push('/login');
        }

        // INFORMACION EXTRA AL COMENTARIO
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // TOMAR COPIA DE COMENTARIOS Y AGREGARLOS AL ARREGLO
        const nuevosComentarios = [...comentarios, comentario];

        // ACTUALIZAR LA BD
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        });

        // ACTUALIZAR EL STATE
        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        });

        setConsultarDB(true); // HAY UN COMENTARIO => CONSULTAR DB
    }

    // FUNCION COMPRUEBA QUE EL CREADOR ESTE AUTENTICADO
    const puedeBorrar = () => {
        if (!usuario) return false;
        if (creador.id === usuario.uid) {
            return true;
        }
    }

    // FUNCOIN QUE ELIMINA UN PRODUCTO
    const eliminarProducto = async () => {
        if (!usuario) {
            return router.push('/login');
        }
        if (creador.id !== usuario.uid) {
            return router.push('/login');
        }
        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Layout>
                {error ? <Error404 /> : (
                    <Contenedor>
                        <h1 css={css`
                        text-align: center;
                        margin-top: 5rem;
                        `}>{nombre}</h1>
                        <ContenedorProducto>
                            <div>
                                <p>
                                    Publicado hace: {formatDistanceToNow(new Date(creado),
                                    { locale: es })}
                                    <p>Por: {creador.nombre} de {empresa}</p>
                                </p>
                                <img src={imagenUrl} />
                                <p>{descripcion}</p>
                                {usuario && (
                                    <Fragment>
                                        <h2>Agrega tu Comentario</h2>
                                        <form onSubmit={agregarComentario}>
                                            <Campo>
                                                <input
                                                    type="text"
                                                    name="mensaje"
                                                    onChange={comentarioChange}
                                                />
                                            </Campo>
                                            <InputSubmit
                                                type="submit"
                                                value="Agregar Comentario"
                                            />
                                        </form>
                                    </Fragment>
                                )}
                                <h2 css={css`margin: 2rem 0;`}>Comentarios</h2>
                                {comentarios.length === 0 ? "No hay comentarios" : (
                                    <ul>
                                        {comentarios.map((comentario, i) => (
                                            <li
                                                key={`${comentario.usuarioId}-${i}`}
                                                css={css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;
                                            `}>
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por:
                                                <span css={css`font-weight: bold;`}>
                                                        {''} {comentario.usuarioNombre}
                                                    </span>
                                                </p>
                                                {esCreador(comentario.usuarioId) &&
                                                    <CreadorProducto>
                                                        Es Creador
                                                </CreadorProducto>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <aside>
                                <Boton
                                    target="_blank"
                                    bgColor="true"
                                    href={url}
                                >Visitar URL</Boton>
                                <div css={css`margin-top: 5rem;`}>
                                    <p css={css`text-align: center;`}>{votos} Votos</p>
                                    {usuario && (
                                        <Boton onClick={votarProducto}>
                                            Votar
                                        </Boton>
                                    )}
                                </div>
                            </aside>
                        </ContenedorProducto>
                        {puedeBorrar() && <Boton
                            onClick={eliminarProducto}
                        >Eliminar Producto</Boton>}
                    </Contenedor>
                )}
            </Layout>
        </div>
    );
}

export default Producto;
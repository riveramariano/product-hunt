import React, { Fragment, useState, useContext } from 'react';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import { FirebaseContext } from '../firebase';
import Error404 from '../components/layout/404';

// VALIDACIONES
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    image: '',
    url: '',
    descripcion: ''
}


const NuevoProducto = () => {

    const [error, setError] = useState(false);
    const [imagen, setImagen] = useState(null);

    const { valores, errores, handleChange, handleSubmit, handleBlur } =
        useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

    // DESTRUCTURING
    const { nombre, empresa, image, url, descripcion } = valores;

    // HOOK DE ROUTING PAR REDIRECCIONAR
    const router = useRouter();

    // CONTEXT CON EL CRUD DE FIREBASE
    const { usuario, firebase } = useContext(FirebaseContext);

    const handleFile = e => {
        if (e.target.files[0]) {
            setImagen(e.target.files[0]);
        }
    }

    const handleUpload = async () => {
        const uploadTask = await firebase.storage.ref(`productos/${imagen.lastModified}${imagen.name}`).put(imagen);
        const downloadURL = await uploadTask.ref.getDownloadURL();
        return downloadURL;
    }

    async function crearProducto() {
        // EN CASO DE QUE NO SE HAYA AUTENTICADO
        if (!usuario) {
            return router.push('/login');
        }

        // CREAR EL OBJ DE NUEVO PRODUCTO
        const producto = {
            nombre,
            empresa,
            url,
            imagenUrl: await handleUpload(),
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: {
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado: []
        }

        // INSERTARLO EN LA BD
        await firebase.db.collection('productos').add(producto);
        return router.push('/');
    }

    return (
        <div>
            <Layout>
                {!usuario ? <Error404 /> : (
                    <Fragment>
                        <h1 css={css`text-align:center; margin-top: 5rem;`}>Nuevo Producto</h1>
                        <Formulario onSubmit={handleSubmit} noValidate>
                            <fieldset>
                                <legend>Información General</legend>
                                <Campo>
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        placeholder="Nombre del Producto"
                                        name="nombre"
                                        value={nombre}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {errores.nombre && <Error>{errores.nombre}</Error>}
                                <Campo>
                                    <label htmlFor="empresa">Empresa</label>
                                    <input
                                        type="text"
                                        id="empresa"
                                        placeholder="Nombre Empresa"
                                        name="empresa"
                                        value={empresa}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {errores.empresa && <Error>{errores.empresa}</Error>}
                                <Campo>
                                    <label htmlFor="image">Imagen</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        storageRef={firebase.storage.ref("productos")}
                                        id="image"
                                        name="image"
                                        value={image}
                                        onInput={(e) => handleFile(e)}
                                    />
                                </Campo>
                                {errores.imagen && <Error>{errores.imagen}</Error>}
                                <Campo>
                                    <label htmlFor="url">URL</label>
                                    <input
                                        type="url"
                                        id="url"
                                        placeholder="URL Producto"
                                        name="url"
                                        value={url}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {errores.url && <Error>{errores.url}</Error>}
                            </fieldset>
                            <fieldset>
                                <legend>Sobre tú Producto</legend>
                                <Campo>
                                    <label htmlFor="descripcion">Descripción</label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={descripcion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {errores.descripcion && <Error>{errores.descripcion}</Error>}
                            </fieldset>

                            <InputSubmit type="submit" value="Crear Producto" />
                        </Formulario>
                    </Fragment>
                )}
            </Layout>
        </div>
    );
}

export default NuevoProducto;
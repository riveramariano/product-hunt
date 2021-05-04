import React, { Fragment, useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import firebase from '../firebase';

// VALIDACIONES
import useValidacion from '../hooks/useValidacion';
import validarLogin from '../validacion/validarLogin';

const STATE_INICIAL = {
    email: '',
    password: ''
}

const Login = () => {

    const [error, setError] = useState(false);

    const { valores, errores, handleChange, handleSubmit, handleBlur } =
        useValidacion(STATE_INICIAL, validarLogin, iniciarSesion);

    // DESTRUCTURING
    const { email, password } = valores;

    async function iniciarSesion() {
        try {
            await firebase.login(email, password);
            Router.push('/');
        } catch (error) {
            console.error('Hubo un Error al autenticar al usuario', error.message);
            setError(error.message);
        }
    }

    return (
        <div>
            <Layout>
                <Fragment>
                    <h1 css={css`text-align:center; margin-top: 5rem;`}>Login</h1>
                    <Formulario onSubmit={handleSubmit} noValidate>
                        <Campo>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Tú Email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.email && <Error>{errores.email}</Error>}
                        <Campo>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Tú Password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.password && <Error>{errores.password}</Error>}
                        {error && <Error>{error}</Error>}
                        <InputSubmit type="submit" value="Iniciar Sesión" />
                    </Formulario>
                </Fragment>
            </Layout>
        </div>
    );
}

export default Login;
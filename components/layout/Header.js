import React, { Fragment, useContext } from 'react'
import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Buscar from '../ui/Buscar';
import Navegacion from './Navegacion';
import { FirebaseContext } from '../../firebase';

const ContenedorHeader = styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;
    @media (min-width: 768px) {
        display: flex;
        justify-content: space-between;
    }
`;

const Logo = styled.a`
    color: var(--naranja);
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: 'Roboto Slab', serif;
    margin-right: 2rem;

    &:hover {
        cursor: pointer;
    }
`;

const Boton = styled.a`
    font-weight: 700;
    text-transform: uppercase;
    border: 1px solid #d1d1d1;
    padding: .8rem 2rem;
    margin-right: 1rem;
    background-color: ${props => props.bgColor ? '#DA552F' : 'white'};
    color: ${props => props.bgColor ? 'white' : '#000'};

    &::last-of-type {
        margin-right: 0;
    }

    &:hover {
        cursor: pointer;
    }
`;

const Header = () => {

    const { usuario, firebase } = useContext(FirebaseContext);

    return (
        <header css={css`
            border-bottom: 2px solid var(--gris3);
            padding: 1rem 0;
        `}>
            <ContenedorHeader>
                <div css={css`display:flex; align-items:center;`}>
                    <Link href="/"><Logo>P</Logo></Link>
                    <Buscar />
                    <Navegacion />
                </div>
                <div css={css`display: flex; align-items: center;`}>
                    {usuario
                        ? (
                            <Fragment>
                                <p css={css` margin-right: 2rem; `}>
                                    Hola: {usuario.displayName}
                                </p>
                                <Boton
                                    bgColor="true"
                                    onClick={() => firebase.cerrarSesion()}
                                >Cerrar Sesión</Boton>
                            </Fragment>)
                        : (
                            <Fragment>
                                <Link href="/login"><Boton bgColor="true">Login</Boton></Link>
                                <Link href="/crear-cuenta"><Boton>Crear Cuenta</Boton></Link>
                            </Fragment>
                        )}
                </div>
            </ContenedorHeader>
        </header>
    );
}

export default Header;
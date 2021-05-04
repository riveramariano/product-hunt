import app from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './config';

class Firebase {
    constructor() {
        if (!app.apps.length) {
            app.initializeApp(firebaseConfig);
        }
        this.auth = app.auth();
    }

    // REGISTRA UN USUARIO
    async registrar(nombre, email, password) {
        const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email, password);
        return await nuevoUsuario.user.updateProfile({
            displayName: nombre
        });
    }

    // LOGIN DE UN USUARIO
    async login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    // CIERRA LA SESION
    async cerrarSesion() {
        await this.auth.signOut();
    }

}

const firebase = new Firebase();
export default firebase;
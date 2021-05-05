import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import firebaseConfig from './config';

class Firebase {
    constructor() {
        if (!app.apps.length) {
            app.initializeApp(firebaseConfig);
        }
        this.auth = app.auth(); // CREAR AUTH
        this.db = app.firestore(); // CREAR BD
        this.storage = app.storage(); // CREAR STORAGE IMG
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
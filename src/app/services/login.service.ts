import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, User} from '@angular/fire/auth';
import { getFirestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private auth = getAuth();
  private db = getFirestore();

  constructor(private afapp: FirebaseApp) {
    this.auth = getAuth(afapp);
    this.db = getFirestore(afapp);
  }
  
  isLoggedIn = false;

  logIn(email: string, password: string):any{  
    createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  }

  signUp(email: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Inicio de sesión exitoso
        const user = userCredential.user;
        this.isLoggedIn = true;
        console.log('Inicio de sesión exitoso');
        resolve(true);
      })
      .catch((error) => {
        // Error en el inicio de sesión
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error en el inicio de sesión:', errorMessage);
        resolve(false);
      });
    });
  }

  resetPassword(email: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      sendPasswordResetEmail(this.auth, email)
      .then(() => {
        // Email de restablecimiento de contraseña enviado
        console.log('Email de restablecimiento de contraseña enviado');
        resolve(true);
      })
      .catch((error) => {
        // Error al enviar el email de restablecimiento de contraseña
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error al enviar el email de restablecimiento de contraseña:', errorMessage);
        resolve(false);
      });
    });
  }  

  signOut(): Promise<any> {
    this.isLoggedIn = false;
    return this.auth.signOut();
  }

  getAuthState(): any {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }

  async addUser(user: User){
    const docRef = doc(this.db, "users");
    const res = await setDoc(docRef, user);   
  }
}

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, User, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCPP1vFH-j44dTveCE_YaClsPooUk38G90",
  authDomain: "psyconica-cd0ad.firebaseapp.com",
  projectId: "psyconica-cd0ad",
  storageBucket: "psyconica-cd0ad.appspot.com",
  messagingSenderId: "874805733374",
  appId: "1:874805733374:web:d676b7b7c56f1dfd1a42af"
};


const firebaseApp: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db: Firestore = getFirestore(firebaseApp);


const auth = getAuth(firebaseApp);

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;


    // const userProfile = {
    //   uid: user.uid,
    //   email: user.email,
    //   displayName: user.displayName,
    //   photoURL: user.photoURL
    // };

    localStorage.setItem('userPhoto', JSON.stringify(user.photoURL));

    console.log('Успешный вход:', user);
    return user;
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    return null;
  }
};




export const signOutGoogle = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('Вы успешно вышли из системы');
  } catch (error) {
    console.error('Ошибка выхода из системы:', error);
  }
};


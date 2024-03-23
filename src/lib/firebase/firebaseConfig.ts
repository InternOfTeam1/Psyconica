import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, User, signOut, TwitterAuthProvider } from 'firebase/auth';
import { Users } from '@/interfaces/collections';
import { addDocumentWithSlug } from '@/lib/firebase/firebaseAdddoc';


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


    const userData: Users = {
      name: user.displayName,
      mail: user.email,
      photo: user.photoURL,
      role: 'user',
      slug: user.displayName,
      userId: user.uid
    };

    localStorage.setItem('userPhoto', JSON.stringify(user.photoURL));

    await addDocumentWithSlug('users', userData, 'userId');

    console.log('Успешный вход:', user);
    return user;
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    return null;
  }
};


export const signInWithTwitter = async (): Promise<User | null> => {
  try {
    const provider = new TwitterAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userData: Users = {
      name: user.displayName,
      mail: user.email,
      photo: user.photoURL,
      role: 'user',
      slug: user.displayName,
      userId: user.uid
    };

    await addDocumentWithSlug('users', userData, 'userId');
    return user;
  } catch (error) {
    console.error('Error with Facebook authentication:', error);
    return null;
  }
};


export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('Successfully signed out');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

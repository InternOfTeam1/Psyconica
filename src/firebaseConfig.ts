import { initializeApp, FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCPP1vFH-j44dTveCE_YaClsPooUk38G90",
  authDomain: "psyconica-cd0ad.firebaseapp.com",
  projectId: "psyconica-cd0ad",
  storageBucket: "psyconica-cd0ad.appspot.com",
  messagingSenderId: "874805733374",
  appId: "1:874805733374:web:d676b7b7c56f1dfd1a42af"
};

let firebaseApp: FirebaseApp;


export const initFirebase = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
  }
};

export const getFirebaseApp = () => {
  if (!firebaseApp) {
    throw new Error('Firebase has not been initialized');
  }
  return firebaseApp;
};

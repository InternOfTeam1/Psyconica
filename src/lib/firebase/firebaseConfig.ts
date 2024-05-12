import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, User, signOut, TwitterAuthProvider } from 'firebase/auth';
import { Users } from '@/interfaces/collections';
import { addDocumentWithSlug } from '@/lib/firebase/firebaseAdddoc';
import { getUser } from '@/redux/slices/authSlice';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';


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
const storage = getStorage(firebaseApp);

const auth = getAuth(firebaseApp);

type User2 = User & {
  mail?: string
  email?: string
}

export const signInWithGoogle = async (): Promise<User2 | null> => {


  try {

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const id = user.uid;
    const firebaseUser = await getUser(user.email as string);
    if (!firebaseUser) {
      await addUserDocument(user);
      return user as User2
    }


    console.log('Успешный вход:', user);
    return firebaseUser as unknown as User2;
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    return null;
  }
};


export const signInWithTwitter = async (): Promise<User2 | null> => {
  try {

    const provider = new TwitterAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const id = user.uid;
    const firebaseUser = await getUser(user.email as string);
    if (!firebaseUser) {
      await addUserDocument(user);
      return user as User2
    }



    console.log('Успешный вход:', user);
    return firebaseUser as unknown as User2;
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    return null;
  }
};

async function addUserDocument(user: User) {
  const userData: Users = {
    name: user.displayName,
    mail: user.email,
    photo: user.photoURL,
    role: 'user',
    slug: user.displayName,
    userId: user.uid,
    answeredQuestions: [],
    aboutUser: 'more',
    contactUser: 'contact',
    video: [],
    slogan: "Psychology should be simple...",
    expert: "Clinical psychologist",
    comments: []
  };
  localStorage.setItem('userPhoto', JSON.stringify(user.photoURL));
  await addDocumentWithSlug('users', userData, 'userId');
}

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('Successfully signed out');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export const uploadImageToStorage = async (file: File): Promise<string | null> => {
  try {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    return null;
  }
};
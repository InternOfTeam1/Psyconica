import { getDb } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';


interface Subject {
  id: string;
  title: string;
  description?: string;
}


export const addDataToCollection = async (collectionName: string, data: object) => {
  try {
    console.log(`Attempting to add data to collection: ${collectionName}`, data);
    const db = getDb();
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const fetchDataFromCollection = async (collectionName: string): Promise<Subject[]> => {
  try {
    console.log(`Fetching data from collection: ${collectionName}`);
    const db = getDb();
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data: Subject[] = [];
    querySnapshot.forEach((doc) => {

      data.push({ id: doc.id, ...doc.data() } as Subject);
    });
    return data;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    throw new Error("Failed to fetch data from collection");
  }
};

import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';


interface Subject {
  id: string;
  title: string;
  description?: string;
}


export const fetchDataFromCollection = async (collectionName: string): Promise<Subject[]> => {
  try {
    console.log(`Fetching data from collection: ${collectionName}`);
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

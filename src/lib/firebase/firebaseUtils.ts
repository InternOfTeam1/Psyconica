import { db } from './firebaseConfig';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';


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


export const addDocumentWithSlug = async <T extends { [key: string]: any }>(
  collectionName: string,
  slug: string,
  data: T
) => {
  try {
    console.log(`Attempting to add document to ${collectionName} with slug: ${slug} and data:`, data);
    await setDoc(doc(db, collectionName, slug), data);
    console.log(`${collectionName} document successfully added with slug: ${slug}`);
  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    throw error;
  }
};

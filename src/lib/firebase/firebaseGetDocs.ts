import { db } from './firebaseConfig';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { Data } from '@/interfaces/collections'

export interface Video {
  url: string;
}


export const fetchDataFromCollection = async (collectionName: string): Promise<Data[]> => {
  try {
    console.log(`Fetching data from collection: ${collectionName}`);
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data: Data[] = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      if (collectionName === 'users') {
        data.push({
          id: doc.id,
          name: docData.name || "No Name",
          description: docData.desc || "No Description",
          mail: docData.mail,
          role: docData.role,
          photo: docData.photo,
          userId: docData.userId,
        });
      } else if (collectionName === 'topics') {
        data.push({
          id: doc.id,
          title: docData.title || "No Title",
          articles: docData.articles,
          canonical: docData.canonical || "No canonical",
          questions: docData.questions,
          video: docData.video
        });
      } else if (collectionName === 'articles') {
        data.push({
          id: doc.id,
          title: docData.title || "No Title",
          canonical: docData.canonical || "No canonical",
          comments: docData.comments,
          likes: docData.likes,
        });
      } else if (collectionName === 'questions') {
        data.push({
          id: doc.id,
          title: docData.title || "No Title",
          canonical: docData.canonical || "No canonical",
          comments: docData.comments,
          likes: docData.likes,
          answers: docData.answers,
          video: docData.video, 
        });
      } else {
        data.push({
          id: doc.id,
          content: docData.content,
          date: docData.date,
          title: ''
        });
      }
    });
    return data;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    throw new Error("Failed to fetch data from collection");
  }
};


export const fetchDoc = async (collectionName: string, slug: any) => {
  try {
    const docRef = doc(db, collectionName, slug);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};
export const fetchVideosFromQuestion = async (docId: string): Promise<Video[]> => {
  try {
    const docRef = doc(db, 'questions', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docData = docSnap.data();
      if (docData.video && Array.isArray(docData.video)) {
        return docData.video.map((url: string) => ({ url }));
      }
    } else {
      console.log("No such document!");
    }
    return [];
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};
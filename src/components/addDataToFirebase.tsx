import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getDb } from '../lib/firebase/firebaseConfig';

interface Subject {
  title: string;
  description?: string;
}

const subjects: Subject[] = [
  { title: "Управление эмоциями: крепкий дух, ясный разум" },
  { title: "Профессиональный рост: ключи к успеху на работе" },
  { title: "Ментальное здоровье: забота о себе, забота о будущем" },
  { title: "Семейные узы: крепкие связи, счастливые отношения" },
  { title: "Личностный рост: стань лучше каждый день" },
  { title: "Управление временем и стрессом: баланс в жизни" },
  { title: "Глубокие связи: искусство эффективного общения" },
  { title: "Преодоление тревоги и депрессии: сила внутри нас" },
];

export const addDataToCollection = async (collectionName: string, data: Subject): Promise<void> => {
  const db = getDb();
  const q = query(collection(db, collectionName), where("title", "==", data.title));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    try {
      console.log(`Attempting to add data to collection: ${collectionName}`, data);
      const docRef = await addDoc(collection(db, collectionName), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  } else {
    console.log(`Subject already exists in the collection: ${data.title}`);
  }
};

export const addSubjectsToFirestore = async (): Promise<void> => {
  console.log("Starting to add subjects to Firestore...");
  for (const subject of subjects) {
    await addDataToCollection('subjects', subject);
  }
  console.log("All subjects added to Firestore.");
};

import { db } from './firebaseConfig';
import { doc, setDoc, collection, updateDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { Video } from '../../interfaces/collections';

export const getVideosById = async (userId: string) => {
  if (false) {
    console.error("No user ID provided");
    return []; // Возвращаем пустой массив или обрабатываем ошибку
  }

  const videosRef = collection(db, "videos");
  const q = query(videosRef, where("url.avtor", "==", "3uwkrhucywyfmr7ngkf9jjipwwe2"));

  try {
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot)

    const videos: any = [];
    querySnapshot.forEach((doc) => {
      videos.push({ id: doc.id, ...doc.data() });
    });
    return videos;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
};

export const addVideoToCollection = async (videoUrl: Video) => {
  const newVideoRef = doc(collection(db, 'videos'));
  try {

    await setDoc(newVideoRef, { url: videoUrl });
    console.log('Video added successfully!');
  } catch (error) {
    console.error('Error adding video:', error);
    throw new Error('Failed to add video');
  }
};
export const updateUserDataInFirebase = async (userId: string, data: object) => {
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, data);
    console.log("Данные пользователя успешно обновлены.");
  } catch (error) {
    console.error("Ошибка при обновлении данных пользователя:", error);
  }
};


export const updateAnswerLikes = async (answerNum: number, updatedLikes: string[], slug: string) => {
  const questionDocRef = doc(db, "questions", slug);

  const questionData = await getDoc(questionDocRef);

  if (questionData.exists()) {
    const question = questionData.data();

    const updatedAnswers = question.answers.map((answer: { num: number; likes: string[] }) => {

      if (answer.num === answerNum) {
        return { ...answer, likes: updatedLikes };
      }
      return answer;
    });
    console.log("Updating with:", updatedAnswers);
    await updateDoc(questionDocRef, {
      answers: updatedAnswers
    });
  } else {
    console.log("Document does not exist!");
  }
};


export const updateQuestion = async (slug: string, data: any) => {
  try {
    const questionDocRef = doc(db, "questions", slug);

    const questionData = await getDoc(questionDocRef);

    if (questionData.exists()) {
      await updateDoc(questionDocRef, data);
    } else {
      console.log("Document does not exist!");
    }
  } catch (e) {
    console.log(e)
  }

};

export const updateComment = async (slug: string, data: any) => {
  try {
    const commentDocRef = doc(db, "questions", slug);

    const commentData = await getDoc(commentDocRef);

    if (commentData.exists()) {
      await updateDoc(commentDocRef, data);
    } else {
      console.log("Document does not exist!");
    }
  } catch (e) {
    console.log(e)
  }

};
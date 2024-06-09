import { Comments, Users } from '@/interfaces/collections';
import { db } from './firebaseConfig';
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove, collection, getDocs } from 'firebase/firestore';

interface UserDataUpdate {
  [key: string]: any;
  ratings?: Record<string, number>;
  averageRating?: number;
  comments?: Comments[];
}


export const getVideosById = async (userId: string) => {
  if (!userId) {
    console.error("No user ID provided");
    return [];
  }

  const userDocRef = doc(db, "users", userId);

  try {
    const docSnapshot = await getDoc(userDocRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      return userData.video || [];
    } else {
      console.log("No such document!");
      return [];
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return [];
  }
};

export const addVideoToCollection = async (videoUrl: string, userId: string,) => {
  const newVideoRef = doc(db, "users", userId);
  try {
    await updateDoc(newVideoRef, {
      video: arrayUnion(videoUrl)
    });
  } catch (error) {
    console.error('Error adding video:', error);
    throw new Error('Failed to add video');
  }
};
export const updateUserDataInFirebase = async (userId: string, data: object) => {
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Ошибка при обновлении данных пользователя:", error);
  }
};

export const removeVideoFromCollection = async (videoUrl: string, userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      video: arrayRemove(videoUrl)
    });
  } catch (error) {
    console.error('Ошибка при удалении видео:', error);
    throw new Error('Не удалось удалить видео');
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

export const updateUser = async (slug: string, data: UserDataUpdate) => {
  try {
    const userDocRef = doc(db, "users", slug);
    const userData = await getDoc(userDocRef);

    if (userData.exists()) {
      const userDocData = userData.data() as UserDataUpdate;

      if (data.ratings) {
        const userDataRatings = Object.values(userDocData.ratings || {}) as number[];
        const dataRatings = Object.values(data.ratings || {}) as number[];
        const ratings = [...userDataRatings, ...dataRatings];
        data.averageRating = ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length;
      }

      await updateDoc(userDocRef, data);
    } else {
      console.error("Document does not exist!");
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export const getUserData = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData;
    } else {
      console.error("No such user!");
      return {};
    }
  } catch (error) {
    console.error("Error getting user data: ", error);
    return {};
  }
};



export async function getUsersWithMatchingQuestions(topicQuestions: { question: string }[]): Promise<Users[]> {
  try {
    const usersCollection = collection(db, 'users');
    const usersDocs = await getDocs(usersCollection);
    const users: Users[] = usersDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Users));

    const matchingUsers = users.filter(user =>
      user.answeredQuestions && user.answeredQuestions.some((question: any) =>
        topicQuestions.some(topicQuestion => topicQuestion === question.title)
      )
    );

    return matchingUsers;
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    return [];
  }
}

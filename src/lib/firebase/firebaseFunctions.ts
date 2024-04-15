import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const updateUserDataInFirebase = async (userId: string, data: object) => {
  const userRef = doc(db, "users", userId);
  console.log(data);
  await updateDoc(userRef, data);
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
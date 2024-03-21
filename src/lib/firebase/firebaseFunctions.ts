import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const updateUserDataInFirebase = async (userId: string, data: object) => {
  const userRef = doc(db, "users", userId);
  console.log(data);
  await updateDoc(userRef, data);
};

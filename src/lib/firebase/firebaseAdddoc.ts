
import slugify from 'slugify';
import { transliterate } from 'transliteration';
import { setDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const addDocumentWithSlug = async <T extends { [key: string]: any }>(
  collectionName: string,
  data: T,
  nameField: any
) => {
  const nameValue = data[nameField];
  const slug = slugify(transliterate(nameValue, { unknown: '-' }), { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  try {
    await setDoc(doc(db, collectionName, slug), { ...data, slug });
    console.log(`${collectionName} document successfully added with slug: ${slug}`);
  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    throw error;
  }
};






import slugify from 'slugify';
import { setDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const addDocumentWithSlug = async <T extends { [key: string]: any }>(
  collectionName: string,
  data: T,
  slugField: string = 'title'
) => {
  const slugValue = data[slugField] ? data[slugField] : (Math.floor(Math.random() * 9000000) + 1000000).toString();
  const slug = slugify(slugValue, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  try {
    await setDoc(doc(db, collectionName, slug), { ...data, slug });
    console.log(`${collectionName} document successfully added with slug: ${slug}`);
  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    throw error;
  }
};





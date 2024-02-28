import { db } from './firebaseConfig';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';
import { Topic, Comment, Video, Article, User, Question } from '@/interfaces/collections'


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



//adding document to firestore

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



const Topic: Topic = {
  slug: "slug-topic",
  questions: [],
  articles: [],
  video: [],
  title: "An Example Topic",
  SEOTitle: "Example Topic SEO Title",
  SEODesc: "This is an SEO description for the example topic",
  canonical: "https://example.com/topics/example-topic"
};

addDocumentWithSlug<Topic>("Topic", Topic.slug, Topic);

const User: User = {
  slug: "slug-user",
  mail: "user@example.com",
  name: "Example User",
  role: 'user',
};

addDocumentWithSlug<User>("User", User.slug, User);

const Question: Question = {
  slug: "slug-question",
  comments: [],
  answers: [],
  video: [],
  title: "An Example Question",
  likes: [],
  SEOTitle: "Example Question SEO Title",
  SEODesc: "This is an SEO description for the example question",
  canonical: "https://example.com/questions/example-question"
};

addDocumentWithSlug<Question>("Question", Question.slug, Question);

const Comment: Comment = {
  slug: "slug-comment",
  content: "This is an example comment.",
  date: new Date().toISOString(),
};
addDocumentWithSlug<Comment>("Comments", Comment.slug, Comment);

const Video: Video = {
  slug: "slug-video",
  title: "An Example Video",
  likes: [],
  SEOTitle: "Example Video SEO Title",
  SEODesc: "This is an SEO description for the example video",
  canonical: "https://example.com/videos/example-video"
};
addDocumentWithSlug<Video>("Videos", Video.slug, Video);

const Article: Article = {
  slug: "slug-article",
  comments: [],
  likes: [],
  title: "An Example Article",
  SEOTitle: "Example Article SEO Title",
  SEODesc: "This is an SEO description for the example article",
  canonical: "https://example.com/articles/example-article"
};
addDocumentWithSlug<Article>("Articles", Article.slug, Article);



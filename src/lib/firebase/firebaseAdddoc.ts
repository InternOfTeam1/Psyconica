
import slugify from 'slugify';
import { Topic, Comment, Video, Article, User, Question } from '@/interfaces/collections'
import { setDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const addDocumentWithSlug = async <T extends { [key: string]: any }>(
  collectionName: string,
  data: T,
  slugField: string = 'title'
) => {
  const slugValue = data[slugField] || 'default-slug';
  const slug = slugify(slugValue, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  try {
    await setDoc(doc(db, collectionName, slug), { ...data, slug });
    console.log(`${collectionName} document successfully added with slug: ${slug}`);
  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    throw error;
  }
};

export const topics = [
  { title: "Личностный рост: стань лучше каждый день" },
  { title: "Семейные узы: крепкие связи, счастливые отношения" },
  { title: "Управление эмоциями: крепкий дух, ясный разум" },
  { title: "Преодоление тревоги и депрессии: сила внутри нас" },
  { title: "Управление временем и стрессом: баланс в жизни" },
  { title: "Ментальное здоровье: забота о себе, забота о будущем" },
  { title: "Глубокие связи: искусство эффективного общения" },
  { title: "Профессиональный рост: ключи к успеху на работе" }
];



const baseTopic: Topic = {
  slug: "",
  questions: [],
  articles: [],
  video: [],
  title: "",
  SEOTitle: "",
  SEODesc: "",
  canonical: ""
};

const User: User = {
  slug: "",
  mail: "user@gmail.com",
  name: "Userfirst",
  role: 'user',
};


const Question: Question = {
  slug: "",
  comments: [],
  answers: [],
  video: [],
  title: "firstQuestion",
  likes: [],
  SEOTitle: "",
  SEODesc: "SEO description for the question",
  canonical: "https://example.com/questions/seo"
};


const Comment: Comment = {
  slug: "",
  content: "hi",
  date: new Date().toISOString(),
};

const Video: Video = {
  slug: "",
  title: "Video-Psychology",
  likes: [],
  SEOTitle: "Video SEO Title",
  SEODesc: "SEO description for video",
  canonical: "https://example.com/videos/example-video"
};


const Article: Article = {
  slug: "",
  comments: [],
  likes: [],
  title: "Article-first",
  SEOTitle: "Article SEO Title",
  SEODesc: "SEO description for  article",
  canonical: "https://example.com/articles/example-article"
};

const addEntities = async () => {

  for (const topic of topics) {
    await addDocumentWithSlug("topics", { ...baseTopic, title: topic.title });
  }

  await addDocumentWithSlug("users", User);
  await addDocumentWithSlug("questions", Question);
  await addDocumentWithSlug("comments", Comment);
  await addDocumentWithSlug("videos", Video);
  await addDocumentWithSlug("articles", Article);
};

addEntities().then(() => console.log("All entities added successfully.")).catch((error) => console.error(error));




import { Topic, Comment, Video, Article, Question } from '@/interfaces/collections';
import { addDocumentWithSlug } from '@/lib/firebase/firebaseAdddoc';
// import slugify from 'slugify';



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


const Question: Question = {
  slug: "",
  comments: [],
  answers: [{
    slug: "",
    title: 'Ответ',
    likes: [],
    content: '',
    num: 1,
    psyPhoto: undefined,
    name: undefined,
    userId: ''
  }],
  video: [],
  topics: [],
  title: "First Question",
  SEOTitle: "",
  SEODesc: "SEO description for the question",
  canonical: "https://example.com/questions/seo"
};

const Comment: Comment = {
  slug: "",
  content: "hi",
  date: new Date().toISOString(),
  num: '',
  answerId: 0
};

const Video: Video = {
  slug: "",
  title: "Video-Psychology",
  likes: [],
  SEOTitle: "Video SEO Title",
  SEODesc: "SEO description for video",
  canonical: "https://example.com/videos/example-video",
  video: [],
  id: ''
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

export const addEntities = async () => {
  await addDocumentWithSlug("questions", Question);
  await addDocumentWithSlug("comments", Comment);
  await addDocumentWithSlug("videos", Video);
  await addDocumentWithSlug("articles", Article);
};



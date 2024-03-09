import { Topic, Comment, Video, Article, Question } from '@/interfaces/collections';
import { addDocumentWithSlug } from '@/lib/firebase/firebaseAdddoc';
import slugify from 'slugify';

const topics = [
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


const Question: Question = {
  slug: "",
  comments: [],
  answers: [{
    slug: "",
    title: 'Answer1',
    likes: [],
  }],
  video: [],
  title: "First Question",
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

export const addEntities = async () => {

  const modifiedQuestion = {
    ...Question,
    answers: Question.answers.map(answer => ({
      ...answer,
      slug: slugify(answer.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g })
    }))
  };

  for (const topic of topics) {
    await addDocumentWithSlug("topics", { ...baseTopic, title: topic.title });
  }

  await addDocumentWithSlug("questions", modifiedQuestion);
  await addDocumentWithSlug("comments", Comment);
  await addDocumentWithSlug("videos", Video);
  await addDocumentWithSlug("articles", Article);
};



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

const questions = [
  {
    title: "Как научиться находить равновесие между работой и личной жизнью?",
    topics: ["Управление временем и стрессом: баланс в жизни", "Профессиональный рост: ключи к успеху на работе"]
  },
  {
    title: "Какие стратегии помогут укрепить семейные узы?",
    topics: ["Семейные узы: крепкие связи, счастливые отношения"]
  },
  {
    title: "Как справиться с эмоциональными всплесками в стрессовых ситуациях?",
    topics: ["Управление эмоциями: крепкий дух, ясный разум"]
  },
  {
    title: "Какие методы помогут преодолеть тревогу и депрессию?",
    topics: ["Преодоление тревоги и депрессии: сила внутри нас"]
  },
  {
    title: "Как развить личностный рост и стать лучше каждый день?",
    topics: ["Личностный рост: стань лучше каждый день"]
  },
  {
    title: "Как улучшить ментальное здоровье в повседневной жизни?",
    topics: ["Ментальное здоровье: забота о себе, забота о будущем"]
  },
  {
    title: "Какие техники помогут углубить и улучшить коммуникативные навыки?",
    topics: ["Глубокие связи: искусство эффективного общения"]
  },
  {
    title: "Как найти мотивацию и вдохновение для профессионального роста?",
    topics: ["Профессиональный рост: ключи к успеху на работе"]
  },
  {
    title: "Какие методы помогут лучше управлять своим временем?",
    topics: ["Управление временем и стрессом: баланс в жизни"]
  },
  {
    title: "Как построить и поддерживать глубокие связи с окружающими?",
    topics: ["Глубокие связи: искусство эффективного общения", "Семейные узы: крепкие связи, счастливые отношения"]
  }
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


  for (const topic of topics) {
    await addDocumentWithSlug("topics", { ...baseTopic, title: topic.title });
  }

  for (const question of questions) {
    const questionTopics = question.topics.map(topicTitle =>
      topics.find(topic => topic.title === topicTitle) || { title: topicTitle }
    );


    const modifiedQuestion = {
      ...Question,
      title: question.title,
      topics: questionTopics.map(t => t.title),
      answers: Question.answers.map(answer => ({
        ...answer,
        slug: slugify(answer.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g })
      })),
      slug: slugify(question.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g })
    };

    // await addDocumentWithSlug("questions", modifiedQuestion);

  }

  // await addDocumentWithSlug("comments", Comment);
  // await addDocumentWithSlug("videos", Video);
  // await addDocumentWithSlug("articles", Article);
};



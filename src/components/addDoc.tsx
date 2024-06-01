import { Topic, Comment, Video, Article, Question } from '@/interfaces/collections';
import { addDocumentWithSlug } from '@/lib/firebase/firebaseAdddoc';
// import slugify from 'slugify';



// const baseTopic: Topic = {
//   slug: "",
//   questions: [],
//   articles: [],
//   video: [],
//   title: "",
//   SEOTitle: "",
//   SEODesc: "",
//   canonical: ""
// };


// const Question: Question = {
//   slug: '',
//   comments: [],
//   answers: [],
//   video: [],
//   topics: [],
//   title: "",
//   SEOTitle: "",
//   SEODesc: "",
//   canonical: ""
// };

const questionsData = [
  {
    slug: "What mistakes are most often made when communicating? How to avoid them",
    comments: [],
    answers: [],
    video: [],
    topics: ["Глубокие связи: искусство эффективного общения"],
    title: "Какие ошибки чаще всего совершаются при общении? Как их избежать",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to overcome communication barriers and develop empathy",
    comments: [],
    answers: [],
    video: [],
    topics: ["Глубокие связи: искусство эффективного общения"],
    title: "Как преодолевать барьеры в общении и развивать эмпатию?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What strategies help develop active listening skills",
    comments: [],
    answers: [],
    video: [],
    topics: ["Глубокие связи: искусство эффективного общения"],
    title: "Какие стратегии помогают развивать навыки активного слушания?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to create and maintain long-lasting and meaningful relationships",
    comments: [],
    answers: [],
    video: [],
    topics: ["Глубокие связи: искусство эффективного общения"],
    title: "Как создавать и поддерживать долговременные и значимые отношения?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How digital technology affects our communication skills",
    comments: [],
    answers: [],
    video: [],
    topics: ["Глубокие связи: искусство эффективного общения"],
    title: "Как цифровые технологии влияют на наши коммуникативные навыки?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What books are recommended to support personal growth",
    comments: [],
    answers: [],
    video: [],
    topics: ["Личностный рост: стань лучше каждый день"],
    title: "Какие книги рекомендуются для поддержки личностного роста?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What is the role of positive thinking in achieving success and happiness",
    comments: [],
    answers: [],
    video: [],
    topics: ["Личностный рост: стань лучше каждый день"],
    title: "Какова роль позитивного мышления в достижении успеха и счастья?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to identify your strengths and use them to your advantage",
    comments: [],
    answers: [],
    video: [],
    topics: ["Личностный рост: стань лучше каждый день"],
    title: "Как определить свои сильные стороны и использовать их в своих интересах?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to identify and set realistic goals for personal growth?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Личностный рост: стань лучше каждый день"],
    title: "Как определить и ставить перед собой реалистичные цели для личностного роста?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What time management methods help you achieve your goals effectively",
    comments: [],
    answers: [],
    video: [],
    topics: ["Личностный рост: стань лучше каждый день"],
    title: "Какие методы тайм-менеджмента помогают эффективно достигать целей?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What relaxation techniques are most effective",
    comments: [],
    answers: [],
    video: [],
    topics: ["Ментальное здоровье: забота о себе, забота о будущем"],
    title: "Какие техники релаксации наиболее эффективны?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How important is the role of sleep in maintaining mental health",
    comments: [],
    answers: [],
    video: [],
    topics: ["Ментальное здоровье: забота о себе, забота о будущем"],
    title: "Как важна роль сна в поддержании ментального здоровья?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to recognize and manage stress in its early stages",
    comments: [],
    answers: [],
    video: [],
    topics: ["Ментальное здоровье: забота о себе, забота о будущем"],
    title: "Как распознать и справляться со стрессом на ранних стадиях?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What resources can help with mental problems?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Ментальное здоровье: забота о себе, забота о будущем"],
    title: "Какие ресурсы могут помочь при возникновении ментальных проблем?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How mindfulness helps deal with depression",
    comments: [],
    answers: [],
    video: [],
    topics: ["Преодоление тревоги и депрессии: сила внутри нас"],
    title: "Как осознанность помогает справляться с депрессией?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What exercises help reduce anxiety?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Преодоление тревоги и депрессии: сила внутри нас"],
    title: "Какие упражнения помогают уменьшить тревожность?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What is the role of physical activity in combating anxiety and depression?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Преодоление тревоги и депрессии: сила внутри нас"],
    title: "Какая роль физической активности в борьбе с тревогой и депрессией?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What self-help techniques are effective for anxiety",
    comments: [],
    answers: [],
    video: [],
    topics: ["Преодоление тревоги и депрессии: сила внутри нас"],
    title: "Какие техники самопомощи эффективны при тревоге?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to recognize early signs of depression",
    comments: [],
    answers: [],
    video: [],
    topics: ["Преодоление тревоги и депрессии: сила внутри нас"],
    title: "Как распознать ранние признаки депрессии?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  }
];

// const Comment: Comment = {
//   slug: "",
//   content: "hi",
//   date: new Date().toISOString(),
//   num: '',
//   answerId: 0
// };

// const Video: Video = {
//   slug: "",
//   title: "Video-Psychology",
//   likes: [],
//   SEOTitle: "Video SEO Title",
//   SEODesc: "SEO description for video",
//   canonical: "https://example.com/videos/example-video",
//   video: [],
//   id: ''
// };


// const Article: Article = {
//   slug: "",
//   comments: [],
//   likes: [],
//   title: "Article-first",
//   SEOTitle: "Article SEO Title",
//   SEODesc: "SEO description for  article",
//   canonical: "https://example.com/articles/example-article"
// };

export const addEntities = async () => {
  for (const data of questionsData) {
    const slug = data.slug
    await addDocumentWithSlug("questions", data, 'slug');
  }

  // await addDocumentWithSlug("comments", Comment);
  // await addDocumentWithSlug("videos", Video);
  // await addDocumentWithSlug("articles", Article);
};



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
  },
  {
    slug: "How to use networking and contacts to advance your career?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Профессиональный рост: ключи к успеху на работе"],
    title: "Как использовать сетевые связи и контакты для продвижения по карьерной лестнице?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to develop leadership skills and effectively manage a team?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Профессиональный рост: ключи к успеху на работе"],
    title: "Как развивать лидерские качества и эффективно управлять командой?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What strategies help develop professional skills?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Профессиональный рост: ключи к успеху на работе"],
    title: "Какие стратегии помогают развивать профессиональные навыки?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to use feedback to improve professional performance?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Профессиональный рост: ключи к успеху на работе"],
    title: "Как использовать обратную связь для улучшения профессиональной эффективности?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to create a positive atmosphere and maintain romance in family life?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Семейные узы: крепкие связи, счастливые отношения"],
    title: "Как создать положительную атмосферу и поддерживать романтику в семейной жизни?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to develop emotional intimacy and understanding in the family?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Семейные узы: крепкие связи, счастливые отношения"],
    title: "Как развивать эмоциональную близость и понимание в семье?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to resolve disagreements and accept compromises in family relationships?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Семейные узы: крепкие связи, счастливые отношения"],
    title: "Как решать разногласия и принимать компромиссы в семейных отношениях?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How important is the joint implementation of goals and interests for family happiness?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Семейные узы: крепкие связи, счастливые отношения"],
    title: "Как важна совместная реализация целей и интересов для семейного счастья?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to develop emotional resilience in everyday life?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Управление эмоциями: крепкий дух, ясный разум"],
    title: "Как развивать эмоциональную стойкость в повседневной жизни?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What is the role of emotional intelligence in managing emotions and making decisions?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Управление эмоциями: крепкий дух, ясный разум"],
    title: "Какова роль эмоционального интеллекта в управлении эмоциями и принятии решений?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to distinguish between emotions and respond to them appropriately?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Управление эмоциями: крепкий дух, ясный разум"],
    title: "Как различать эмоции и реагировать на них адекватно?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What methods are effective for managing anger and irritation?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Управление эмоциями: крепкий дух, ясный разум"],
    title: "Какие методы эффективны для управления гневом и раздражением?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to balance work, personal life and time for yourself?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Управление временем и стрессом: баланс в жизни"],
    title: "Как сбалансировать работу, личную жизнь и время для себя?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How important is it to set boundaries and learn to say “no” to prevent overwhelm?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Управление временем и стрессом: баланс в жизни"],
    title: "Как важно установить границы и научиться говорить “нет” для предотвращения перегрузки?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to develop effective time management skills?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Управление временем и стрессом: баланс в жизни"],
    title: "Как развить навыки эффективного планирования времени?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "How to determine priorities and avoid confusion?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Управление временем и стрессом: баланс в жизни"],
    title: "Как определить приоритеты и избежать растерянности?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
  {
    slug: "What methods can effectively delegate tasks and reduce stress?",
    comments: [],
    answers: [],
    video: [],
    topics: ["Управление временем и стрессом: баланс в жизни"],
    title: "Какие методы позволяют эффективно делегировать задачи и сократить уровень стресса?",
    SEOTitle: "",
    SEODesc: "",
    canonical: ""
  },
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



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
    "title": "Как научиться находить равновесие между работой и личной жизнью?",
    "topics": ["Управление временем и стрессом: баланс в жизни", "Профессиональный рост: ключи к успеху на работе"],
    "answers": "Установите четкие границы между работой и личной жизнью, придерживайтесь установленного графика и найдите время для отдыха и хобби. Практикуйте майндфулнес и делегирование задач для снижения стресса."
  },
  {
    "title": "Какие стратегии помогут укрепить семейные узы?",
    "topics": ["Семейные узы: крепкие связи, счастливые отношения"],
    "answers": "Регулярно проводите качественное время вместе, общайтесь открыто и честно, практикуйте благодарность и поддержку, а также совместное решение проблем и конфликтов."
  },
  {
    "title": "Как справиться с эмоциональными всплесками в стрессовых ситуациях?",
    "topics": ["Управление эмоциями: крепкий дух, ясный разум"],
    "answers": "Освойте техники дыхательных упражнений, медитации и майндфулнес. Развивайте навыки самосознания и саморегуляции, а также практикуйте ассертивное общение."
  },
  {
    "title": "Какие методы помогут преодолеть тревогу и депрессию?",
    "topics": ["Преодоление тревоги и депрессии: сила внутри нас"],
    "answers": "Ведите здоровый образ жизни, включая регулярные физические упражнения и сбалансированное питание. Практикуйте техники релаксации и майндфулнес, и не стесняйтесь обращаться за профессиональной помощью."
  },
  {
    "title": "Как развить личностный рост и стать лучше каждый день?",
    "topics": ["Личностный рост: стань лучше каждый день"],
    "answers": "Установите четкие цели и пошагово двигайтесь к их достижению. Постоянно учите новому, принимайте вызовы и выходите из зоны комфорта. Окружите себя вдохновляющими людьми и сохраняйте позитивный настрой."
  },
  {
    "title": "Как улучшить ментальное здоровье в повседневной жизни?",
    "topics": ["Ментальное здоровье: забота о себе, забота о будущем"],
    "answers": "Практикуйте самоуход и самосострадание, ведите дневник благодарности, развивайте социальные связи и уделяйте время хобби и отдыху. Избегайте перегрузок и научитесь говорить \"нет\"."
  },
  {
    "title": "Какие техники помогут углубить и улучшить коммуникативные навыки?",
    "topics": ["Глубокие связи: искусство эффективного общения"],
    "answers": "Освойте активное слушание и эмпатичное общение, практикуйте четкое и конструктивное выражение своих мыслей и чувств. Развивайте навыки невербального общения и открытости."
  },
  {
    "title": "Как найти мотивацию и вдохновение для профессионального роста?",
    "topics": ["Профессиональный рост: ключи к успеху на работе"],
    "answers": "Задавайте себе вдохновляющие цели, окружите себя мотивирующими людьми и историями успеха. Празднуйте свои достижения и изучайте новые области знаний и навыков."
  },
  {
    "title": "Какие методы помогут лучше управлять своим временем?",
    "topics": ["Управление временем и стрессом: баланс в жизни"],
    "answers": "Используйте технику Помодоро для улучшения концентрации, планируйте свой день заранее и устанавливайте приоритеты задач. Избегайте многозадачности и уделяйте время для регулярных перерывов."
  },
  {
    "title": "Как построить и поддерживать глубокие связи с окружающими?",
    "topics": ["Глубокие связи: искусство эффективного общения", "Семейные узы: крепкие связи, счастливые отношения"],
    "answers": "Выделите время для регулярных встреч и глубоких бесед с близкими. Будьте открытыми и честными в своих чувствах и мыслях, проявляйте интерес и уважение к мнениям и переживаниям других."
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
    title: 'Ответ',
    likes: [],
    content: '',
    num: 1,
    psyPhoto: undefined,
    name: undefined
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
  url: [],
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


  for (const topic of topics) {
    await addDocumentWithSlug("topics", { ...baseTopic, title: topic.title });
  }

  for (const question of questions) {
    const questionTopics = question.topics.map(topicTitle =>
      topics.find(topic => topic.title === topicTitle) || { title: topicTitle }
    );

    const preparedAnswers = question.answers.split(';').map((answerText, index) => ({
      slug: slugify(answerText.trim(), { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }).substring(0, 30),
      content: answerText.trim(),
      title: answerText.trim().substring(0, 11),
      likes: [],
      num: index + 1
    }));

    const modifiedQuestion = {
      ...Question,
      title: question.title,
      topics: questionTopics.map(t => t.title),
      answers: preparedAnswers,
      slug: slugify(question.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }).substring(0, 30)
    };

    await addDocumentWithSlug("questions", modifiedQuestion);

  }

  await addDocumentWithSlug("comments", Comment);
  await addDocumentWithSlug("videos", Video);
  await addDocumentWithSlug("articles", Article);
};



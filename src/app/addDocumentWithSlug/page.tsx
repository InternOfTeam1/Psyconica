import { addDocumentWithSlug } from "@/lib/firebase/firebaseUtils";
import { Topic, Comment, Video, Article, User, Question } from '@/interfaces/collections'
const Questions: React.FC = () => {


  const Topic: Topic = {
    slug: "example-topic",
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
    slug: "example-user",
    mail: "user@example.com",
    name: "Example User",
    role: 'user',
  };

  addDocumentWithSlug<User>("User", User.slug, User);

  const Question: Question = {
    slug: "example-question",
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
    slug: "example-comment",
    content: "This is an example comment.",
    date: new Date().toISOString(),
  };
  addDocumentWithSlug<Comment>("Comments", Comment.slug, Comment);

  const Video: Video = {
    slug: "example-video",
    title: "An Example Video",
    likes: [],
    SEOTitle: "Example Video SEO Title",
    SEODesc: "This is an SEO description for the example video",
    canonical: "https://example.com/videos/example-video"
  };
  addDocumentWithSlug<Video>("Videos", Video.slug, Video);

  const Article: Article = {
    slug: "example-article",
    comments: [],
    likes: [],
    title: "An Example Article",
    SEOTitle: "Example Article SEO Title",
    SEODesc: "This is an SEO description for the example article",
    canonical: "https://example.com/articles/example-article"
  };
  addDocumentWithSlug<Article>("Articles", Article.slug, Article);

  return (
    <div>
      <h1>addDocumentWithSlug</h1>
    </div>
  );
};

export default Questions;

import ArticlesComponent from '@/components/ArticlesComponent';
import { Video } from "@/interfaces/collections";
import { fetchDataFromCollection } from "@/lib/firebase/firebaseGetDocs";
import { Metadata } from "next";

<<<<<<< HEAD
// export async function generateMetadata(): Promise<Metadata> {
//   return {
//     title: 'Articles Page',
//     description: 'Page showing a list of articles',
//   };
// }
=======
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Статьи по Психологии',
    description: 'Страница со списком статей на различные психологические темы. Читайте статьи от экспертов и узнайте больше о психологии.',
  };
}
>>>>>>> ca7bd57a0f8c66d10ebc46e74886ef31a15edf58

function shuffleAndTrimVideos(videos: Video[], maxLength: number): Video[] {
  let shuffledVideos = videos.slice();

  for (let i = shuffledVideos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledVideos[i], shuffledVideos[j]] = [shuffledVideos[j], shuffledVideos[i]];
  }
  return shuffledVideos.filter(v => v.video).slice(0, maxLength);
}

const Articles: React.FC = async () => {
  const rawData = await fetchDataFromCollection('videos');
  const articlesData = await fetchDataFromCollection('articles');

  if (!rawData || !articlesData) {
    return null;
  }

  const videos = rawData as Video[];
  const shuffledVideos = shuffleAndTrimVideos(videos, 10);

  return <ArticlesComponent />;
}

export default Articles;
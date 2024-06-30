import ArticlesComponent from '@/components/ArticlesComponent';
import { Data, ArticleData } from "@/interfaces/collections";
import { fetchDataFromCollection } from "@/lib/firebase/firebaseGetDocs";
import { Metadata } from "next";
import { notFound } from 'next/navigation';
import { shuffleAndTrimVideos, shuffleArray } from '../questions/page'; 

interface Video {
  url: string;
}


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Статьи по Психологии',
    description: 'Страница со списком статей на различные психологические темы. Читайте статьи от экспертов и узнайте больше о психологии.',
  };
}

const Articles: React.FC = async () => {

  const [rawData, articlesData, usersData] = await Promise.all([fetchDataFromCollection('videos'), fetchDataFromCollection('articles'), fetchDataFromCollection('users') as unknown as Data[]])

  if (!rawData || !articlesData || !usersData) {
    notFound();
  }

  let videosData: Video[] = [];

  usersData.forEach((user: any) => {
    if (user.video && user.video.length > 0) {
      user.video.forEach((videoUrl: string) => {
        videosData.push({ url: videoUrl });
      });
    }
  });

  
  
  if (!videosData.length) {
    console.log("No videos found");
    notFound();
  }

  const filteredAndTransformedArticles: ArticleData[] = articlesData
  .filter(article => article.title !== undefined)
  .map(article => ({
    id: article.id,
    slug: article.slug,
    title: article.title as string, 
    SEOTitle: article.SEOTitle || '',
    SEODesc: article.SEODesc || '',
    canonical: article.canonical || ''
  }));

  const shuffledVideos = shuffleArray(videosData);


  return <ArticlesComponent articlesData={filteredAndTransformedArticles} videos={shuffledVideos} originalArticles={filteredAndTransformedArticles} />;
}

export default Articles;
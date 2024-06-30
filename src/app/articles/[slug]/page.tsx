
import React from 'react';
import ArticlePageClient from "../components/ArticlePageClient";
import { fetchDoc, fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';
import { Article,  Users } from '@/interfaces/collections';
import { notFound } from 'next/navigation';
import { shuffleArray } from '@/app/questions/page';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}
interface Video {
  url: string;
}

const ArticlePage: React.FC<ArticlePageProps> = async ({ params }) => {
  const { slug } = params;

  const [rawData, usersData, articleClientData] = await Promise.all([
    fetchDataFromCollection('videos'),
    fetchDataFromCollection('users') as unknown as Users[], fetchDoc('articles', slug) as unknown as Article | null
  ]);

  if (!rawData || !usersData || !articleClientData) {
    notFound();
  }

  let videosData: Video[] = [];
  usersData.forEach((user) => {
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

  const shuffledVideos = shuffleArray(videosData);

  return (
    <div>
      <ArticlePageClient articleClientData={articleClientData} videos={shuffledVideos} />
    </div>
  );
}

export default ArticlePage;

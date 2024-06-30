import React from 'react';
import QuestionsComponent from '@/components/forQuestionsPage';
import { Data, Video, QuestionData } from "@/interfaces/collections";
import { fetchDataFromCollection } from "@/lib/firebase/firebaseGetDocs";
import { Metadata } from "next";
import { notFound } from 'next/navigation';
import { cache } from 'react';



export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Вопросы и Ответы Психологов',
    description: 'Список вопросов и ответов от психологов. Найдите ответы на интересующие вас вопросы и получите профессиональные советы от опытных психологов.',
  };
}

export const shuffleAndTrimVideos = cache(function (videos: Video[], maxLength: number): Video[] {
  let shuffledVideos = videos.slice();

  for (let i = shuffledVideos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledVideos[i], shuffledVideos[j]] = [shuffledVideos[j], shuffledVideos[i]];
  }
  return shuffledVideos.filter(v => v.video).slice(0, maxLength);
});

export const shuffleArray = cache((array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
});

const Questions: React.FC = async () => {
  const [rawData, questionsData, usersData] = await Promise.all([
    fetchDataFromCollection('videos') as unknown as Video[],
    fetchDataFromCollection('questions') as unknown as QuestionData[],
    fetchDataFromCollection('users') as unknown as Data[]
  ]);

  if (!rawData || !questionsData || !usersData) {
    notFound();
  }

  const filteredAndTransformedQuestions: QuestionData[] = questionsData
  .filter(question => typeof question.title === 'string' && question.id !== undefined && question.answers !== undefined)
  .map(question => ({
    id: question.id,
    title: question.title as string,
    answers: question.answers,
    comments: question.comments || [],
    SEOTitle: question.SEOTitle || '',
    SEODesc: question.SEODesc || '',
    canonical: question.canonical || '',
  }));

  let videosData: Video[] = [];

  usersData.forEach((user: any) => {
    if (user.video && user.video.length > 0) {
      user.video.forEach((videoUrl: string) => {
        videosData.push({ url: videoUrl, id: '', video: [], title: '', description: '', slug: '', content: '', date: '', likes: [], SEOTitle: '', SEODesc: '', canonical: '', userId: '' });
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
      <QuestionsComponent videos={shuffledVideos} questionsData={filteredAndTransformedQuestions} originalQuestionsData={filteredAndTransformedQuestions} usersData={undefined} />
    </div>
  );
};

export default Questions;

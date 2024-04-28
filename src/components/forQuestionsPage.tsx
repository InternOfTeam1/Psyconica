"use client"
import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from 'react';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';
import { Data, Video } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import VideoGallery from "./VideoGallery";

interface QuestionData {
  id: string;
  slug?: string;
  title: string;
}

type Props = {
  videos: Video[]
}

const QuestionsComponent: React.FC<Props> = ({ videos }) => {
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsData = await fetchDataFromCollection('questions') as Data[];

        const filteredAndTransformedQuestions = questionsData
          .filter(question => question.title !== undefined)
          .map(question => ({
            id: question.id,
            slug: question.slug,
            title: question.title as string
          }));
        setQuestions(filteredAndTransformedQuestions);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки вопросов: ', error);
        setError('Не удалось загрузить вопросы.');
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleClick = async (url: string, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      await router.push(url);
    } catch (error) {
      console.error('Ошибка навигации:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  const renderIframe = (url: string, width: string, height: string) => (
    <iframe
      width={width}
      height={height}
      src={url}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="rounded-lg"
    ></iframe>
  );
  const openModal = (videoUrl: string): void => {
    setSelectedVideoUrl(videoUrl);
    setIsOpen(true);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 mt-[-50px]">
      <h1 className="text-2xl font-bold text-center mb-6">Вопросы</h1>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-1/4 px-1 mb-4 lg:mb-0  xs:mt-2 xs:mx-auto lg:mx-0 lg:mt-0">
          <VideoGallery />
        </div>
        <div className="w-full lg:w-3/4 px-4" style={{ maxWidth: '860px' }}>
          <div className="flex flex-col space-y-4">
            {questions.map((question) => (
              <div key={question.id} onClick={(e) => handleClick(`/questions/${question.slug || question.id}`, e)}
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                <h2 className="text-xl font-semibold">{question.title}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Link href={HOME_ROUTE}>
        <button className="inline-block mt-4 mb-10 px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple hover:shadow-lg focus:outline-none hover:bg-blue-600">
          Вернуться на главную
        </button>
      </Link>
    </div>
  );
}

export default QuestionsComponent;

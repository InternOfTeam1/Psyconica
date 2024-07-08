"use client"
import React, { useEffect, useState } from 'react';
import { Video } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import VideoGallery from "./VideoGallery";


interface QuestionData {
  SEOTitle?: string;
  SEODesc?: string;
  canonical?: string;
  id: string;
  slug?: string;
  title: string;
}

type Props = {
  videos: Video[]
  questionsData: QuestionData[]
  originalQuestionsData: QuestionData[]
  usersData: any
}

const QuestionsComponent: React.FC<Props> = ({ videos, questionsData, originalQuestionsData, usersData }) => {
  const [questions, setQuestions] = useState<QuestionData[]>(() => questionsData);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const filterQuestions = () => {
      if (searchTerm.trim() === '') {
        setQuestions(originalQuestionsData);
      } else {
        const filteredQuestions = questions.filter(question =>
          question.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setQuestions(filteredQuestions);
      }
    };

    filterQuestions();
  }, [searchTerm, originalQuestionsData]);


  const handleClick = async (url: string, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      await router.push(url);
    } catch (error) {
      console.error('Ошибка навигации:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-2 py-3">
      <div className="flex xs:flex-col sm:flex-col md:flex-col lg:flex-col">
        <h1 className="mx-auto text-2xl font-bold text-center sm:mt-0 sm:mb-[-30px] md:mb-[-30px] lg:mb-[-30px] xl:mb-[-30px]">Вопросы</h1>

        <div className="mx-auto ml-15 mb-[-10px] flex items-center xs:mt-5 sm:mt-10 sm:items-center sm:ml-15 md:mt-15 md:ml-auto md:text-center md:items-center lg:mt-0 lg:ml-5 xl:ml-10">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Введите текст для поиска"
            className="p-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring focus:border-blue-500 md:text-center md:items-center"
          />
        </div>
      </div>

      <div className="flex flex-wrap xs:flex-col-reverse lg:flex-row mt-10">
        <div className="w-full lg:w-1/4 px-1 mb-4 lg:mb-0  xs:mt-2 xs:mx-auto lg:mx-0 lg:mt-0">
          <VideoGallery videosData={videos} />
        </div>
        <div className="w-full mx-auto lg:w-3/4 lg:ml-0 xl:ml-0 mb-8 px-4 pb-3" style={{ maxWidth: '870px' }}>

          <div className="flex flex-col space-y-4" style={{ maxHeight: '788px', overflowY: 'auto', paddingBottom: '10px' }}>
            {questions.map((question) => (
              <Link key={question.slug || question.id} href={`/questions/${question.slug || question.id}`}>
                <div key={question.id} onClick={(e) => handleClick(`/questions/${question.slug || question.id}`, e)}

                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleClick(`/questions/${question.slug || question.id}`, e)}
                  className="bg-white mx-2 p-5 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100">


                  <h2 className="text-xl font-semibold leading-6">{question.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Link href={HOME_ROUTE}>
        <button className="inline-block mt-4 mb-10 ml-5 px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple hover:shadow-lg focus:outline-none hover:bg-blue-600">
          Вернуться на главную
        </button>
      </Link>
    </div>
  );
}

export default QuestionsComponent;

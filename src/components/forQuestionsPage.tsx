"use client"
import React, { useEffect, useState } from 'react';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';
import { Data } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import VideosFetcher from '@/components/VideosFetcher';
import { useRouter } from 'next/navigation';


const QuestionsComponent: React.FC = () => {
  const [questions, setQuestions] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleClick = async (url: any) => {
    setIsLoading(true);
    await router.push(url);
    setIsLoading(false);
  };


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsData = await fetchDataFromCollection('questions');
        setQuestions(questionsData);
      } catch (error) {
        console.error('Error loading topics: ', error);
        setError('Failed to load topics.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto max-w-[1200px] px-4">

      <h1 className="text-2xl font-bold text-center my-6">Вопросы</h1>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-1/4 px-1 mb-4 lg:mb-0">
          <VideosFetcher />
        </div>
        <div className="w-full lg:w-3/4 px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((question, index) => (
              <div key={index} onClick={() => handleClick(`/questions/${question.slug || question.id}`)} className="cursor-pointer">
                <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                  <h2 className="text-xl font-semibold">{question.title}</h2>
                  {isLoading ? <h2>Loading...</h2> : <h2 className="text-xl font-semibold">{question.title}</h2>}
                </div>
              </div>
            ))}
          </div>
          <Link href="/home">
            <button className="inline-block mt-4 mb-10 px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple hover:shadow-lg focus:outline-none hover:bg-blue-600">
              Вернуться на главную
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

}

export default QuestionsComponent;

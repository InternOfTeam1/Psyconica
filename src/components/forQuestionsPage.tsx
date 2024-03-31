"use client"
import React, { useEffect, useState } from 'react';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';
import { Data } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';

const QuestionsComponent: React.FC = () => {
  const [questions, setQuestions] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto max-w-[1200px] px-4">
      
      <h1 className="text-2xl font-bold text-center my-6">Вопросы</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((question, index) => (
          <Link key={index} href={`/questions/${question.slug || question.id}`}>
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{question.title}</h2>
            </div>
          </Link>

        ))}
      </div>

      <Link href={HOME_ROUTE}>
        <button className="inline-block mt-4 mb-10 px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600">
          Вернуться на главную
        </button>
      </Link>
    </div>
  );
};

export default QuestionsComponent;

"use client"

import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from 'react';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';
import { Data } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import VideoGallery from "./VideoGallery";

interface ArticleData {
  id: string;
  slug?: string;
  title: string;
  SEOTitle?: string;
  SEODesc?: string;
  canonical?: string;
}

const ArticlesComponent: React.FC = () => {
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesData = await fetchDataFromCollection('articles') as Data[];

        const filteredAndTransformedArticles = articlesData
          .filter(article => article.title !== undefined)
          .map(article => ({
            id: article.id,
            slug: article.slug,
            title: article.title as string,
            SEOTitle: article.SEOTitle as string,
            SEODesc: article.SEODesc as string,
            canonical: article.canonical as string
          }));

        setArticles(filteredAndTransformedArticles);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки статей: ', error);
        setError('Не удалось загрузить статьи.');
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const articlesData = await fetchDataFromCollection('articles') as Data[];

      const filteredArticles = articlesData
        .filter(article =>
          article.title !== undefined &&
          article.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(article => ({
          id: article.id,
          slug: article.slug,
          title: article.title as string
        }));

      setArticles(filteredArticles);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки вопросов: ', error);
      setError('Не удалось загрузить вопросы.');
      setLoading(false);
    }
  };

  const handleClick = async (slug: string, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      await router.push(`/articles/${slug}`);
    } catch (error) {
      console.error('Ошибка навигации:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center w-full h-full">
      <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-2 py-3 mt-[-50px]">
      <h1 className="text-2xl font-bold text-center mb-6">Статьи</h1>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Введите текст для поиска"
          className="p-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring focus:border-blue-500"
        />
        <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500">
          Поиск
        </button>
      </div>

      <div className="flex flex-wrap xs:flex-col-reverse lg:flex-row mt-10">
        <div className="w-full lg:w-1/4 px-1 mb-4 lg:mb-0  xs:mt-2 xs:mx-auto lg:mx-0 lg:mt-0">
          <VideoGallery />
        </div>
        <div className="w-full mx-auto lg:w-3/4 lg:ml-0 xl:ml-0 mb-8 px-4 pb-3" style={{ maxWidth: '870px' }}>
          <div className="flex flex-col space-y-4" style={{ maxHeight: '788px', overflowY: 'auto', paddingBottom: '10px' }}>
            {articles.map((article) => (
              <div key={article.id} onClick={(e) => handleClick(article.slug || '', e)}
                className="bg-white mx-2 p-5 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                <h2 className="text-xl font-semibold leading-6">{article.title}</h2>
              </div>
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

export default ArticlesComponent;

"use client";

import React from 'react';
import { Article } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import VideoGallery from "./VideoGallery";

type Props = {
  articleData: Article;
};

const TopicPage: React.FC<Props> = ({ articleData }) => {
  console.log(articleData)
  return (
    <div className="container mx-auto max-w-7xl px-2 py-3 mt-[-50px]">
      <div className="flex flex-wrap xs:flex-col-reverse lg:flex-row mt-10">
        <div className="w-full lg:w-1/4 px-1 mb-4 lg:mb-0 xs:mt-2 xs:mx-auto lg:mx-0 lg:mt-0">
          <VideoGallery />
        </div>
        <div className="container w-full bg-white mx-auto lg:w-3/4 lg:ml-0 xl:ml-0 mt-[-10px] mb-8 px-10 pb-3 shadow-xl rounded-2xl" style={{ maxWidth: '860px', maxHeight: '790px', overflowY: 'auto', paddingBottom: '10px' }}>
          <div className="flex flex-col space-y-4" style={{ maxHeight: '788px', overflowY: 'auto', paddingBottom: '10px' }}>
            <h1 className="text-center text-xl font-bold mt-4 mb-4">{articleData.title}</h1>
            <div className="prose mb-8">
              <p className="w-full bg-slate-300 text-justify mb-3">{articleData.article}</p>
            </div>
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
};

export default TopicPage;
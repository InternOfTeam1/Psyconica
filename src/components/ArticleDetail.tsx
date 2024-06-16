"use client";

import React from 'react';
import { Article } from '@/interfaces/collections'; // Assuming this interface exists and matches your data structure
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import VideoGallery from "./VideoGallery";

type Props = {
  articleData: Article;
};

const ArticleDetail: React.FC<Props> = ({ articleData }) => {
  console.log(articleData)
  return (
    <div className="container mx-auto max-w-7xl px-2 py-3 mt-[-50px]">
      <div className="flex flex-wrap xs:flex-col-reverse lg:flex-row mt-10">
        <div className="w-full lg:w-1/4 px-1 mb-4 lg:mb-0 xs:mt-2 xs:mx-auto lg:mx-0 lg:mt-0">
          <VideoGallery />
        </div>
        <div className="w-full mx-auto bg-white lg:w-3/4 lg:ml-0 xl:ml-0 px-5 pt-3 pb-3 shadow-xl rounded-2xl" style={{ maxWidth: '860px' }}>
          <div className="flex flex-col space-y-4">
            <h1 className="w-full font-semibold bg-amber-300 text-gray-600 px-7 py-3 rounded-2xl text-center xs:text-sm xs:px-3 sm:text-sm sm:px-4 md:text-base md:px-5 lg:text-lg lg:px-6 xl:text-xl xl:px-7">{articleData.title}</h1>
            <div className="prose px-3">
              <p className="w-full text-justify font-medium text-gray-800 xs:text-sm sm:text-sm md:text-base lg:text-base lg:leading-6 mt-2">{articleData.article}</p> {/* Assuming articleData.content holds the article text */}
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

export default ArticleDetail;




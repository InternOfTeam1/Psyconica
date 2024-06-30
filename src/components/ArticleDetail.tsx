"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Article, Video } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import VideoGallery from "./VideoGallery";

type Props = {
  articleData: Article;
  videos: Video[]
};

const ArticleDetail: React.FC<Props> = ({ articleData, videos }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const MAX_HEIGHT = 310;
  console.log(articleData)

  useEffect(() => {
    if (articleRef.current && articleRef.current.scrollHeight > MAX_HEIGHT) {
      setShowButton(true);
    }
  }, []);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  return (
    <div className="container mx-auto max-w-7xl px-5 py-3 mt-[-50px]">
      <div className="flex flex-wrap xs:flex-col-reverse lg:flex-row mt-10">
        <div className="w-full lg:w-1/4 px-1 mb-4 lg:mb-0 xs:mt-2 xs:mx-auto lg:mx-0 lg:mt-0">
          <VideoGallery videosData={videos} />
        </div>
        <div className="w-full mx-auto bg-white lg:w-3/4 lg:ml-0 xl:ml-0 mb-3 px-5 pt-3 pb-3 shadow-xl rounded-2xl" style={{ maxWidth: '860px' }}>
          <div className="flex flex-col space-y-4">
            <h1 className="w-full font-semibold bg-amber-300 text-gray-600 px-7 py-3 rounded-2xl text-center xs:text-sm xs:px-3 sm:text-sm sm:px-4 md:text-base md:px-5 lg:text-lg lg:px-6 xl:text-xl xl:px-7">{articleData.title}</h1>
            <div className="prose px-3">
              <div
                ref={articleRef}
                className={`w-full text-justify font-medium text-gray-800 xs:text-sm sm:text-sm md:text-base lg:text-base lg:leading-6 mt-2 ${!isExpanded ? 'max-h-[310px] overflow-hidden' : ''}`}
                style={{ transition: 'max-height 0.3s ease' }}
              >
                <p>{articleData.article}</p>
              </div>
              {showButton && !isExpanded && (
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleExpand}
                    className="bg-gray-500 text-white font-bold py-1 px-2 rounded hover:bg-gray-700 mt-2"
                  >
                    Еще
                  </button>
                </div>
              )}
            </div>
            {articleData.image ? (
              <div className="w-full flex justify-center mt-4 py-3" style={{ maxHeight: '350px' }}>
                <img src={articleData.image} alt="Article Image" width={500} className="max-w-full h-auto rounded-lg" />
              </div>
            ) : (
              <div className="w-full flex justify-center mt-4">
                <p>Image not available</p>
              </div>
            )}
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




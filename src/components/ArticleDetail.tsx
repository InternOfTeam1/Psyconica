import { useEffect, useState } from 'react';
import MetaData from '@/components/MetaData';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { Article } from '@/interfaces/collections';
import  VideoGallery from "@/components/VideoGallery";

const ArticleDetails: React.FC<{ article: Article }> = ({ article }) => {
    return (
      <div>
        <MetaData title={article.title} description={article.article} />
        <div className="container mx-auto max-w-7xl px-4 py-6 mt-[-40px]">
      <div className="flex flex-wrap -mx-4 xs:flex-col-reverse xs:px-5 sm:px-5 md:px-5 lg:px-5 lg:flex-row xl:px-5">
        <div className="w-full lg:w-1/4 px-1 lg:mb-0">
          <VideoGallery />
        </div>
        <div className="w-full mx-auto mb-5 lg:w-3/4 lg:ml-0 xl:ml-0 px-4 py-4 bg-white shadow-xl rounded-2xl" style={{ maxWidth: '850px' }}>
        <h1 className="font-semibold bg-amber-300 text-gray-600 px-7 py-3 rounded-2xl leading-6 text-center xs:text-sm xs:px-3 sm:text-sm sm:px-4 md:text-base md:px-5 lg:text-lg lg:px-6 xl:text-xl xl:px-7">{article.title}</h1>
        <p className= "mt-5">{article.article}</p>
        </div>
      </div>
      </div>
      </div>
    );
};

export default ArticleDetails;




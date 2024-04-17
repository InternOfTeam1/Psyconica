"use client"
import React, { useState, useEffect } from 'react';
import TopicsComponent from '@/components/topics';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center mx-auto" >
      <h1 className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 leading-none text-center ">
        Психология должна быть простой!
      </h1>


      <div className="z-30 mx-auto flex flex-col items-center min-w-full ">
        <div className="z-30 flex flex-col lg:flex-row items-center justify-center ">
          <div className="z-30 mt-[8%] lg:mt-[-2%] xl:mt-[8%]">

            <TopicsComponent position="left" />
          </div>
          <div
            className="mx-auto w-full bg-no-repeat bg-custom-size"
            style={{
              backgroundImage: `url('/mainLogo.png')`
            }}>

          </div>

          <div className="z-30 mt-[-25%] xs:mt-0 sm:mt-0 md:mt-[3%] xs:mb-10 sm:mb-10 md:mb-10 lg:mb-0 lg:mt-[-2.3%] xl:mb-0 xxl:mb-0 xl:mt-[8.5%]" >
            <TopicsComponent position="right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
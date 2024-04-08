"use client"
import React, { useState, useEffect } from 'react';
import { SubjectsList } from '@/components/SubjectsList';


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
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-center  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-balsamiq-sans font-bold text-pink-600 mb-2">
        Психология должна быть простой!
      </h2>

      <div className="z-30 mx-auto flex flex-col items-center min-w-full ">
        <div className="z-30 flex flex-col lg:flex-row items-center justify-center ">
          <div className="z-30 mt-[8%] lg:mt-[-2%] xl:mt-[8%]">

            <SubjectsList position="left" />
          </div>
          <div
            className="mx-auto w-full bg-no-repeat bg-custom-size"
            style={{
              backgroundImage: `url('/mainLogo.png')`
            }}>

          </div>

          <div className="z-30 mt-[-25%] xs:mt-[-16%] s:mt-0 sm:mt-0 md:mt-[3%] lg:mt-[-2.3%] xl:mt-[8.5%]" >
            <SubjectsList position="right" />
          </div>
        </div>
      </div>
    </div>

  );
};

export default Home;
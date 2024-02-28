"use client"
import React from 'react';
import Image from 'next/image';
import SubjectsList from '@/components/SubjectsList';
import Header from '@/components/header';

const Home: React.FC = () => {
  return (
<<<<<<< HEAD
  <div className="flex flex-col items-center min-h-screen p-4 mb-0">
    {/* <h2 className="z-10 text-lg sm:text-xl md:text-3xl lg:text-4xl font-balsamiq-sans font-bold text-pink-600 mb-[-1rem] pl-12">отношения должны быть простыми!</h2> */}
    <div className="w-full flex flex-col items-center justify-center md:flex-col lg:flex-row">
      <div className="z-10 mb-4 sm:mb-5 md:mb-6 lg:mb-[-6rem] lg:ml-[-4rem] xl:ml-[-1rem]">
        <h2 className="z-10 text-lg sm:text-xl md:text-3xl lg:text-6xl font-unbounded font-black text-gray-600 mb-4 pl-12">Психология отношений</h2>
        <SubjectsList position="left" />
      </div>
      <div className="z-10 relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-6xl mx-auto my-8 h-[50vh] sm:h-[50vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh]">
        <Image
          src="/mainLogo.png"
          alt="Main logo"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="z-10 mt-2 md:mt-6 lg:mt-40 sm:mt-0 sm:ml-0 md:ml-0 lg:ml-[-6rem] xl:mk-10">
        <SubjectsList position="right" />
=======
    <div className="flex flex-col items-center min-h-screen p-4 mb-0">
      <Header />
      <h2 className="z-10 text-lg sm:text-xl md:text-3xl lg:text-4xl font-balsamiq-sans font-bold text-pink-600 mb-[-1rem] pl-12">Психология должна быть простой!</h2>
      <div className="w-full flex flex-col items-center justify-center md:flex-col lg:flex-row">
        <div className="z-10 mb-4 sm:mb-5 md:mb-6 lg:mb-[-6rem] lg:ml-[-4rem] xl:ml-[-1rem]">
          <h2 className="z-10 text-lg sm:text-xl md:text-3xl lg:text-6xl font-unbounded font-black text-gray-600 mb-4 pl-12">Психология отношений</h2>
          <SubjectsList position="left" />
        </div>
        <div className="z-10 relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-6xl mx-auto my-8 h-[50vh] sm:h-[50vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh]">
          <Image
            src="/mainLogo.png"
            alt="Main logo"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="z-10 mt-2 md:mt-6 lg:mt-40 sm:mt-0 sm:ml-0 md:ml-0 lg:ml-[-6rem] xl:mk-10">
          <SubjectsList position="right" />
        </div>
>>>>>>> 31ffb31169b79709cac0f2f3daba229ccbaea10a
      </div>
    </div>
  );
};

export default Home;
"use client"
import React from 'react';
import Image from 'next/image';
import SubjectsList from '@/components/SubjectsList';
import Header from '@/components/header';

const Home: React.FC = () => {
  return (
   
    <div className="flex flex-col items-center min-h-screen p-4 mb-0">
      < Header />
      <h2 className="z-10 text-xl md:text-3xl lg:text-4xl font-balsamiq-sans font-bold  text-pink-600 mb-[-1rem] pl-12">отношения должны быть простыми!</h2>
      <div className="flex flex-col md:flex-row items-center justify-center w-full">
        
        <div className="z-10 mb-4 sm:mb-5 md:mb-[-6rem] md:ml-[-4rem] lg:ml-[-1rem]">
          <h2 className="z-10 text-xl md:text-3xl lg:text-6xl font-unbounded font-black  text-gray-600 mb-4 pl-12">Психология отношений</h2>
          <SubjectsList position="left" />
    </div>
    <Image src="/mainLogo.png" alt="Main logo" className="z-0 mx-0 my-4 mt-[-10rem] sm:my-0 md:my-0" width={1000} height={900} />
    <div className="z-10 mt-2 md:mt-40 sm:mt-0 sm:ml-0 md:ml-[-6rem] lg:mk-10">
      <SubjectsList position="right" />
    </div>      
  </div>      
</div>
  );
};

export default Home;
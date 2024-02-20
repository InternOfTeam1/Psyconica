"use client"
import React from 'react';
import Image from 'next/image';
import SubjectsList from '@/components/SubjectsList';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center min-h-screen p-4">
  <div className="flex flex-col md:flex-row items-center justify-center w-full">
        <div className="z-10 mb-4 sm:mb-5 md:mb-5 md:ml-[-4rem] lg:ml-[-1rem]">
          <SubjectsList position="left" />
    </div>
    <Image src="/mainLogo.png" alt="Main logo" className="z-0 mx-0 my-4  sm:my-0 md:my-0" width={1000} height={900} />
    <div className="z-10 mt-4 md:mt-0 sm:mt-0 sm:ml-0 md:ml-[-6rem] lg:mk-10">
      <SubjectsList position="right" />
    </div>      
  </div>      
</div>
  );
};

export default Home;
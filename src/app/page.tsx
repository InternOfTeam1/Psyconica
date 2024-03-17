import React from 'react';
import Image from 'next/image';
import { SubjectsList } from '@/components/SubjectsList';

const Home: React.FC = () => {
  // it's for adding data to firestore through code faster
  // addEntities().then(() => console.log("All entities added successfully.")).catch((error) => console.error(error));
  // it's forbidden uncomment addEntities function
  return (
    <div className="flex flex-col items-center min-h-screen p-4 mb-0 mx-auto max-w-custom xs:mt-[-4rem] sm:mt-[-5rem]  md:mt-[-5rem] lg:mt-[-10rem] xl:mt-[-10rem]">
      <div className="w-full flex flex-col lg:flex-row items-center justify-center">
        <div className="flex flex-col mb-4 sm:mb-[-3rem] md:mb-[-3rem] lg:mb-[-6rem] lg:ml-[-4rem] xl:ml-[-1rem]">
          <h2 className=" lg:text-right  sm:text-xl md:text-md lg:text-5xl xl:text-6xl text-gray-600 mb-4 ">Психология отношений</h2>
          <SubjectsList position="left" />
        </div>
        <div className="z-10 relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-6xl mx-auto my-8 h-[50vh] sm:h-[40vh] md:h-[50vh] lg:h-[70vh] xl:h-[80vh]">
          <div className=" lg:absolute xl:absolute xl:top-[30%] lg:top-[20%] bottom-0 left-0 right-10">
            <Image
              src="/mainLogo.png"
              alt="Main logo"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
        <div className="z-10 mt-2 md:mt-[-20] lg:mt-40 sm:mt-[-3rem] sm:ml-0 md:ml-0 lg:ml-[-6rem] xl:mk-10">
          <SubjectsList position="right" />
        </div>
      </div>
    </div>
  );
};

export default Home;
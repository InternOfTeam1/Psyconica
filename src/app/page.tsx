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
    <>
      <h2 className="text-center text-xl  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-balsamiq-sans font-bold text-pink-600 mb-36">
        Психология должна быть простой!
      </h2>

      <div className="z-30  flex flex-col items-center w-full p-4 mb-0 mx-auto  xs:mt-[-4rem] sm:mt-[-5rem]  md:mt-[-5rem] lg:mt-[-10rem] xl:mt-[-10rem]">
        <div className="z-30 w-full flex flex-col lg:flex-row items-center justify-center ">
          <div className="z-30 flex flex-col mb-4 sm:mb-[-3rem] md:mb-[-3rem] lg:mb-[-122px] lg:mr-[-50px] ">

            <SubjectsList position="left" />
          </div>

          <div
            className="mx-auto bg-no-repeat bg-custom-size"
            style={{
              backgroundImage: `url('/mainLogo.png')`,
            }}>

          </div>

          <div className=" z-11 mt-2 md:mt-1 lg:mt-40 lg:ml-[-37px] xl:mt-[181px]  sm:mt-1 xl:mk-10 " >
            <SubjectsList position="right" />
          </div>
        </div>
      </div>
    </>

  );
};

export default Home;

// lg:ml-[-4rem] xl:ml-[-2rem]

// it's for adding data to firestore through code faster
// addEntities().then(() => console.log("All entities added successfully.")).catch((error) => console.error(error));
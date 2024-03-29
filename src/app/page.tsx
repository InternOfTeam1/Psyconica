import React from 'react';
import { SubjectsList } from '@/components/SubjectsList';


const Home: React.FC = () => {

  return (
    <>
      <h2 className="text-center text-xl  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-balsamiq-sans font-bold text-pink-600 mb-6">
        Психология должна быть простой!
      </h2>

      <div className="flex flex-col items-center min-h-screen p-4 mb-0 mx-auto max-w-custom xs:mt-[-4rem] sm:mt-[-5rem]  md:mt-[-5rem] lg:mt-[-10rem] xl:mt-[-10rem] ">
        <div className="w-full flex flex-col md:flex-row items-center justify-center">
          <div className="flex flex-col w-[310px] mb-4 sm:mb-[-3rem] md:mb-[-3rem] lg:mb-[-122px]  ">

            <SubjectsList position="left" />
          </div>

          <div
            className="z-10 relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-6xl mx-auto sm:mb-[-1rem] xl:mb-[-1rem]  lg:mb-[-3rem] xl:h-[39rem] bg-cover bg-no-repeat bg-custom-size"
            style={{
              backgroundImage: `url('/mainLogo.png')`,
            }}>

          </div>

          <div className="z-10 mt-2 md:mt-1 w-[310px] lg:mt-40 xl:mt-[181px]  sm:mt-1 sm:ml-0 md:ml-0 lg:ml-[-8rem] xl:mk-10">
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
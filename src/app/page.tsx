import React from 'react';
import { SubjectsList } from '@/components/SubjectsList';


const Home: React.FC = () => {

  return (
    <>
      <h2 className="text-center text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-balsamiq-sans font-bold text-pink-600" >
        Психология должна быть простой!
      </h2>

      <div className="flex flex-col items-center min-h-screen p-4 mb-0 mx-auto max-w-custom xs:mt-[-4rem] sm:mt-[-5rem]  md:mt-[-5rem] lg:mt-[-10rem] xl:mt-[-10rem]">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center">
          <div className="flex flex-col mb-4 sm:mb-[-3rem] md:mb-[-3rem] lg:mb-[-6rem] lg:ml-[-4rem] xl:ml-[-1rem]">

            <SubjectsList position="left" />
          </div>
          <div className="z-10 relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-6xl mx-auto sm:mb-[-1rem]  xl:mb-[-1rem] lg:h-[40vh] lg:mb-[-3rem] xl:h-[90vh]">
            <div className="">
              <img src="/mainLogo.png" alt="logo"
                className="w-fit h-fit xs:mb-[-1rem] xs:mt-[-1rem] sm:mt-5 sm:mb-[-1rem] md:mt-3  md:mb-[-1rem] lg:mt-[-3rem] xl:mt-[10rem] sm:-ml-[-2rem] md:-ml-[-1rem] lg:-ml-1"></img>
            </div>
          </div>
          <div className="z-10 mt-2 md:mt-1 lg:mt-40 sm:mt-1 sm:ml-0 md:ml-0 lg:ml-[-6rem] xl:mk-10">
            <SubjectsList position="right" />
          </div>
        </div>
      </div>
      {/* <div className="z-10 relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-6xl mx-auto sm:mb-[-1rem] md:mb-[-3rem] lg:mb-[-15rem] xl:mb-[-1rem] sm:h-[40vh] md:h-[50vh] lg:h-[70vh] xl:h-[90vh]"> */}

    </>

  );
};

export default Home;



// it's for adding data to firestore through code faster
// addEntities().then(() => console.log("All entities added successfully.")).catch((error) => console.error(error));
"use client";


import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import React, { useEffect, useState } from 'react';
import { Users } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useParams } from 'next/navigation';
import { useAppSelector } from '../redux/hooks';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import Image from 'next/image';
import { FaPen } from "react-icons/fa";
import { addDocumentWithSlug } from "@/lib/firebase/firebaseAdddoc";
import { User } from 'firebase/auth';
import Question from '@/app/questions/[slug]/page';
import VideoGallery from './VideoGallery';
import PsychologistDashboard from './PsychologistVideoManager'



export function fetchUserData(slug: any) {
  return fetchDoc('users', slug);
}

const PsyAccount = () => {
  

  const [userData, setUserData] = useState<any>(null);
  const params = useParams();
  const userSlug: any = params.slug;
  const userId = useAppSelector((state) => state.auth.user?.id);
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const userName = useAppSelector((state) => state.auth.user?.name);
  const userPhoto = useAppSelector((state) => state.auth.user?.photo);
  // const userSlogan = useAppSelector((state) => state.auth.user?.slogan);
  // const userContact = useAppSelector((state) => state.auth.user?.contactUser);
  // const userAbout = useAppSelector((state) => state.auth.user?.aboutUser);
  const dispatch: AppDispatch = useDispatch();


  useEffect(() => {
    async function fetchUserData(userId: any) {
      try {
        const fetchedUserData = await fetchDoc('users', userId);
        setUserData(fetchedUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    if (userId) {
      fetchUserData(userId);
    }

  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl mt-[-40px]">
      <div className="flex flex-wrap -mx-1 lg:-mx-1">
        <div className="w-full lg:w-1/4 px-1 lg:mb-0">
        <VideoGallery />
        {userData && <PsychologistDashboard />}
        </div>
        <div className="container ml-5 px-2 py-4 max-w-3xl bg-white shadow-xl rounded-2xl " style={{ maxWidth: '700px' }}>
        {userData && (
 <div className="text-center mb-5">
 <p className='flex items-center justify-center font-semibold bg-amber-300 px-7 py-1 rounded-2xl text-center text-gray-800 leading-7'>
   <Image
     src="/bigLogo.webp"
     alt="logo"
     width={50}
     height={50}
     className="mr-2" />
   {userData.slogan}
 </p>
</div>
           )}
          {
            userData && (
              <>
          <div className="flex ml-5 items-start">
            {userData.photo && (
              <div className="user-photo-container mt-2 mr-5">
                <Image src={userData.photo} alt="User Avatar" width={200} height={200} />
              </div>
            )}
            <div className="flex flex-col">
              <p className='font-semibold text-gray-800 leading-6'>{userData.name}</p>
            </div>
          </div>
                    <div>
                    <p className='font-bold text-gray-800 leading-6 mt-2 ml-5'>About:</p>
                    <p className=' text-gray-600 leading-6 mt-2 mx-5'>{userData.aboutUser}</p>
                  </div>  
                  <div>
                    <p className='font-bold text-gray-800 leading-6 mt-2 ml-5'>Contact:</p>
                    <p className=' text-gray-600 leading-6 mt-2 ml-5'>{userData.contactUser}</p>
                  </div>  
                <div>
                  <p className='font-semibold  text-gray-800 leading-6 mt-2 ml-5'>Answered Question:</p>
                  <ul className=' text-gray-600 leading-6 mt-2 ml-5'>
                    {userData.answeredQuestions && userData.answeredQuestions.length > 0 ? (
                      userData.answeredQuestions.map((question: any, index: number) => (
                        <li key={index}>{question}</li>
                      ))
                    ) : (
                      <li>No answered questions yet.</li>
                    )}
                  </ul>
                </div>
              </>
            )
          }


          <br />
          {!userData && (
  <div className="flex justify-center"> 
    <Link href={HOME_ROUTE}>
      <button className="mt-4 px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600 xs:text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm">
        Вернуться на главную
      </button>       
    </Link>
  </div>
)}
        </div >
      </div>
    </div>

  );
};

export default PsyAccount;

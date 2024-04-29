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

    console.log(userData, 'ffffffff')
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl mt-[-40px]">
      <div className="flex flex-wrap -mx-1 lg:-mx-1">

        <div className="container ml-5 px-2 py-4 max-w-3xl bg-white shadow-xl rounded-2xl " style={{ maxWidth: '820px' }}>
          {
            userData && (
              <>
                <p>{userData.name}</p>
                {userData.photo && (
                  <div className="user-photo-container">
                    <Image src={userData.photo} alt="User Avatar" width={100} height={100} />
                  </div>
                )}
                <p>About: {userData.aboutUser}</p>
                <p>Contact: {userData.contactUser}</p>

                <div>
                  <p>Answered Question:</p>
                  <ul>
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
          <Link href={HOME_ROUTE}>
            <button className="inline-block mt-4 px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600 xs:text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm">
              Вернуться на главную
            </button>
          </Link>
        </div >
      </div>
    </div>

  );
};

export default PsyAccount;
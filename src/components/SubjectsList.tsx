'use client';
import React, { useEffect, useState } from 'react';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';
import { Data } from '@/interfaces/collections';
import Link from 'next/link';



export const SubjectsList: React.FC<{ position: 'left' | 'right' }> = ({ position }) => {
  const [subjects, setSubjects] = useState<Data[]>([]);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjectsData = await fetchDataFromCollection('topics');
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error loading subjects: ', error);
      }
    };
    loadSubjects();
  }, []);

  const half = Math.ceil(subjects.length / 2);
  const backgroundImageUrl = '/8924461.png';
  const subjectsToShow =
    position === 'left' ? subjects.slice(0, half) : subjects.slice(half);


  return (
    <div className={" z-10 mx-auto  grid grid-cols-1 gap-2 p-4 sm:p-6 md:gap-2 lg:gap-2 xl:gap-3"}>
      {subjectsToShow.map((subject) => (
        <Link href={`/topics`} key={subject.id}>
          <div
            className=" z-10 flex flex-col justify-center bg-no-repeat bg-center rounded-lg"
            style={{
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: '120%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >

            <div className="z-10 space-y-2 p-3 sm:p-4 md:space-y-2 lg:p-4 xl:p-6 ">
              <div className="z-10 xs:pr-7 sm:pl-16 sm:pr-10 md:pl-5 md:pr-8  font-balsamiq-sans font-bold text-small-caps">
                <h2 className="pl-3 text-xs sm:text-sm md:text-base xl:text-lg text-gray-600">
                  {subject.title}
                </h2>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};


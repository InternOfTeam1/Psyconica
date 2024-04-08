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
    <div className={" z-10 mx-auto  grid grid-cols-1 gap-2 sm:p-6 md:pl-15 md:gap-2 lg:gap-2 xl:gap-6"}>
      {subjectsToShow.map((subject) => (
        <Link href={`/topics`} key={subject.id}>
          <div
            className=" z-10 w-full flex flex-col justify-center bg-no-repeat bg-center rounded-lg"
            style={{
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: '120%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >

            <div className="z-10 space-y-2 md:space-y-2  xs:pt-2 xs:pb-2 xs:pl-7 xs:pr-7 sm:pl-16 sm:pr-12 md:pl-[3.25rem] md:pr-[3.25rem] md:pt-1 md:pb-1 lg:pl-[2.25rem] lg:pr-[1.25rem] lg:pt-1 lg:pb-1">
              <h2 className="font-balsamiq-sans font-bold text-small-caps text-xs sm:text-sm md:text-base lg:text-base xl:text-lg text-gray-600">
                {subject.title}
              </h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};


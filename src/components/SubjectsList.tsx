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

  const containerClasses = `max-w-custom min-w-custom mx-auto ${position === 'left' ? 'mt-[70px]' : 'mt-0'} lg:pl-20  xl:pl-0 grid grid-cols-1 gap-2 p-4 sm:p-6 md:gap-3 lg:gap-3 xl:gap-4`

  return (
    <div className={containerClasses}>
      {subjectsToShow.map((subject) => (
        <Link href={`/topics`} key={subject.id}>
          <div
            className="flex flex-col justify-center bg-cover bg-center rounded-lg"
            style={{
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: '120%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="z-10 space-y-2 p-3 sm:p-4 md:space-y-2 md:p-4 lg:p-2 xl:p-2">
              <div className=" sm:pl-16 sm:pr-10 md:pl-5 md:pr-1 lg:pl-10 xl:pl-14 xl:pr-10 font-balsamiq-sans font-bold text-small-caps">
                <h2 className="text-sm sm:text-sm md:text-lg lg:text-ld xl:text-custom text-gray-600">
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
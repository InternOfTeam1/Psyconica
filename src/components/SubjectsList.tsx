"use client"
import React, { useEffect, useState } from 'react';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseUtils';


interface Subject {
  id: string;
  title: string;
  description?: string;
}

export const SubjectsList: React.FC<{ position: 'left' | 'right' }> = ({ position }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjectsData = await fetchDataFromCollection('subjects');
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error loading subjects: ", error);
      }
    };

    loadSubjects();
  }, []);

  const half = Math.ceil(subjects.length / 2);
  const backgroundImageUrl = '/8924461.png'; 
  const subjectsToShow = position === 'left' ? subjects.slice(0, half) : subjects.slice(half);

  return (
    <div className="max-w-custom min-w-custom mx-auto lg:pl-20  xl:pl-0 grid grid-cols-1 gap-2 p-4 sm:p-6 md:gap-3 lg:gap-3 xl:gap-4">
      {subjectsToShow.map((subject) => (
        <div
          key={subject.id}
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
              <h2 className="text-sm sm:text-sm md:text-lg lg:text-ld xl:text-custom text-gray-600">{subject.title}</h2>
              <p className="text-xs sm:text-sm md:text-md lg:text-sm xl:text-xl">{subject.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

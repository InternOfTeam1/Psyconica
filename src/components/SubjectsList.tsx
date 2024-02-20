"use client"
import React, { useEffect, useState } from 'react';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseUtils'; 

interface Subject {
  id: string;
  title: string;
  description?: string;
}

const SubjectsList: React.FC<{ position: 'left' | 'right' }> = ({ position }) => {
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
  const subjectsToShow = position === 'left' ? subjects.slice(0, half) : subjects.slice(half);

  const backgroundImageUrl = '/8924461.png'; 

  return (
  <div className="grid grid-cols-1 gap-4 sm:p-6 md:gap-6 lg:gap-4 ">
{subjectsToShow.map((subject) => (
  <div 
    key={subject.id} 
    className="rounded-lg space-y-4 p-4  sm:p-6 md:space-y-3 lg:space-y-4 md:p-4 lg:p-8 flex flex-col justify-center items-start bg-cover bg-center"
     style={{ backgroundImage: `url(${backgroundImageUrl})`, minWidth: '400px', minHeight: '150px' }}
  >
    <div className=" sm:pl-10 sm:pr-10 md:pl-5 md:pr-10 lg:pl-8 lg:pr-5  font-balsamiq-sans font-bold text-small-caps"> 
      <h2 className=" pl-6 pr-1 sm:text-xl md:text-2xl  lg:text-2xl text-gray-600">{subject.title}</h2>
      <p className="text-sm sm:text-base md:text-base lg:text-lg">{subject.description}</p>
    </div>
  </div>
))}
</div>
);
};


export default SubjectsList;
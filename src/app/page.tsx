"use client"
import React, { useState, useEffect } from 'react';
import { fetchDataFromCollection } from "@/lib/firebase/firebaseUtils";
import Image from 'next/image';

interface Subject {
  id: string;
  title: string;
  description?: string;
}

const Home: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchDataFromCollection('subjects');
        setSubjects(data as Subject[]);
      } catch (error) {
        console.error("Error getting data from Firestore: ", error);
      }
    };

    getData();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-1/2">
        <h1 className="text-center">Welcome to Psyconica!</h1>
        <Image src="/mainPhoto.jpeg" alt="img" width={500} height={500} className="mx-auto block" />
        {/* example code !!! */}
        <div>
          {subjects.map((subject) => (

            <div key={subject.id}>
              <h2>{subject.title}</h2>

              {subject.description && <p>{subject.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

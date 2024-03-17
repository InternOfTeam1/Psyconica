"use client";
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { useEffect, useState } from 'react';
import { Answers } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
// import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { db } from '@/lib/firebase/firebaseConfig';
// import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';

const QuestionDetail = ({ params,
}: {
  params: { slug: any };
}) => {
  const [questionData, setQuestionData] = useState<{ title: string; answers: Answers[] } | null>(null);
  const questionSlug = params.slug

  useEffect(() => {
    const fetchData = async () => {
      if (questionSlug) {
        const data: any = await fetchDoc('questions', questionSlug);
        setQuestionData(data);
      }
    };

    fetchData();
  }, [questionSlug]);

  // const usersData = await fetchDoc('users', );

  // const handleLike = async (answerSlug: string) => {
  //   const questionRef = doc(db, 'questions', questionSlug);



  //   await updateDoc(questionRef, {
  //     [`answers.${answerSlug}.likes`]: arrayUnion("userId")
  //   }).then(() => {
  //     console.log('Like added');
  //   }).catch((error) => {
  //     console.error('Error adding like: ', error);
  //   });
  // };

  return (
    <div className="container mx-auto px-4">


      {questionData && questionData.answers.map((answer: Answers, index: number) => (
        <>
          <h2 className="text-xl font-semibold">{questionData.title}</h2>
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h2>{answer.title}</h2>
          </div>
        </>

      ))}

      <Link href={HOME_ROUTE}>
        <button className="inline-block mt-4 px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600">
          Вернуться на главную
        </button>
      </Link>

    </div>


  );
};

export default QuestionDetail;
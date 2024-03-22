"use client";
import PsychologistAnswerCard from './PsychologistAnswerCard';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { useEffect, useState } from 'react';
import { Answers } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useParams } from 'next/navigation';
// import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { db } from '@/lib/firebase/firebaseConfig';
// import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';

function fetchQuestionData(slug: {}) {
  return fetchDoc('questions', slug);
}

const QuestionDetail = () => {
  const [questionData, setQuestionData] = useState<{ title: string; answers: Answers[] } | null>(null);
  const params = useParams();
  const questionSlug = params.slug;

  useEffect(() => {
    const fetchData = async () => {
      if (questionSlug) {
        const data: any = await fetchQuestionData(questionSlug);
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
    <div className="container mx-auto px-4 py-4 max-w-xl bg-white shadow-xl rounded-2xl">


      {questionData && questionData.answers.map((answer: Answers, index: number) => (
         <PsychologistAnswerCard key={index} answer={answer} />
         ))}

      <Link href={HOME_ROUTE}>
        <button className="inline-block mt-4 px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600 xs:text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm">
          Вернуться на главную
        </button>
      </Link>

    </div>

    


  );
};

export default QuestionDetail;
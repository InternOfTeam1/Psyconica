"use client";
import { FaThumbsUp } from 'react-icons/fa'; 
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
  const [likedAnswers, setLikedAnswers] = useState<string[]>([]); 
  const params = useParams();
  const questionSlug = params.slug;

  const handleLikeClick = (answerSlug: string) => {
    if (likedAnswers.includes(answerSlug)) {
      setLikedAnswers(prevLikedAnswers => prevLikedAnswers.filter(slug => slug !== answerSlug));
    } else {
      setLikedAnswers(prevLikedAnswers => [...prevLikedAnswers, answerSlug]);
    }
  };

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
      {questionData && (
        <>
          <h2 className="font-semibold bg-amber-300 text-gray-600 px-7 py-3 rounded-2xl leading-6 text-center xs:text-sm xs:px-3 sm:text-sm sm:px-4 md:text-base md:px-5 lg:text-lg lg:px-6 xl:text-lg xl:px-7">{questionData.title}</h2>
          {questionData.answers.map((answer: Answers, index: number) => {
            return (
              <div key={index}>
                <div className="flex items-center mb-4">
                    <p className="font-semibold text-gray-700">{index + 1}.</p>
                  <div>
                    <h3 className="font-semibold text-gray-600 px-7 pt-3 rounded-2xl leading-6">{answer.title}</h3>
                    <p className="text-gray-500 text-sm mt-2">{answer.content}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaThumbsUp
                    className={`text-green-500 mr-1 cursor-pointer ${likedAnswers.includes(answer.slug) ? 'text-green-700' : ''}`}
                    onClick={() => handleLikeClick(answer.slug)} />
                  <span className="text-gray-500">{likedAnswers.filter(slug => slug === answer.slug).length}</span>
                </div>
                <hr className="my-4 border-gray-400" />
              </div>
            );
          })}
        </>
      )}
      <Link href={HOME_ROUTE}>
        <button className="inline-block mt-4 px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600 xs:text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm">
          Вернуться на главную
        </button>
      </Link>
    </div>
  );
};

export default QuestionDetail;
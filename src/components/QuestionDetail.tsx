"use client";
import { FaThumbsUp } from 'react-icons/fa';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { useEffect, useState } from 'react';
import { Answers } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useParams } from 'next/navigation';
import { useAppSelector } from '../redux/hooks';
import { updateAnswerLikes } from '@/lib/firebase/firebaseFunctions';
import Cookies from 'js-cookie';


function fetchQuestionData(slug: {}) {
  return fetchDoc('questions', slug);
}

function generateGuestId() {
  let guestId = Cookies.get('guestId');
  if (!guestId) {
    guestId = crypto.randomUUID();
    Cookies.set('guestId', guestId, { expires: 3650 }); // Установка cookies на 10 лет
  }
  return guestId;
}



const QuestionDetail = () => {
  const [questionData, setQuestionData] = useState<{ title: string; answers: Answers[] } | null>(null);
  const params = useParams();
  const questionSlug: any = params.slug;
  const userId = useAppSelector((state) => state.auth.user?.id);
  const MAX_LIKES = 100;
  let userOrGuestId: any = userId || generateGuestId();

  const handleLikeClick = async (answerNum: any, answerLikes: string[]) => {
    const isLiked = answerLikes.includes(userOrGuestId);
    let updatedLikes;

    if (!userOrGuestId) {
      console.error("User ID is undefined.");
      return;
    }

    if (isLiked) {
      updatedLikes = answerLikes.filter(id => id !== userOrGuestId);
      console.log(updatedLikes)

    } else {
      updatedLikes = [...answerLikes, userOrGuestId];
    }
    try {
      await updateAnswerLikes(answerNum, updatedLikes, questionSlug);
      console.log("Likes updated successfully.");
    } catch (error) {
      console.error("Error updating likes", error);
    }

    const updatedQuestionData: any = { ...questionData };
    const answerIndex = updatedQuestionData.answers.findIndex((answer: { num: any; }) => answer.num === answerNum);
    if (answerIndex !== -1) {
      updatedQuestionData.answers[answerIndex].likes = updatedLikes;
      setQuestionData(updatedQuestionData);
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

  return (
    <div className="container mx-auto px-4 py-4 max-w-xl bg-white shadow-xl rounded-2xl">
      {questionData && (
        <>
          <h2 className="font-semibold bg-amber-300 text-gray-600 px-7 py-3 rounded-2xl leading-6 text-center xs:text-sm xs:px-3 sm:text-sm sm:px-4 md:text-base md:px-5 lg:text-lg lg:px-6 xl:text-lg xl:px-7">{questionData.title}</h2>
          {questionData.answers.map((answer: Answers, index: number) => {
            const progressWidth = (answer.likes.length / MAX_LIKES) * 100;
            return (
              <div key={index} className="mt-4">
                <div className="flex items-start mb-4">
                  <p className="font-semibold text-gray-600 mr-2">{answer.num}.</p>
                  <div>
                    <h3 className="font-semibold text-gray-600 leading-6">{answer.title}</h3>
                    <p className="text-gray-500 text-sm mt-2">{answer.content}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaThumbsUp
                    className={`text-green-500 mr-1 cursor-pointer ${answer.likes.includes(userOrGuestId) ? 'text-green-700' : ''}`}
                    onClick={() => handleLikeClick(answer.num, answer.likes)} />
                  <span className="text-gray-500">{answer.likes.length}</span>
                  <div className="flex-1 mx-2.5">
                    <div className="h-2.5 border border-gray-300 rounded">
                      <div className="h-full bg-teal-400 rounded" style={{ width: `${progressWidth}%` }}></div>
                    </div>
                  </div>
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
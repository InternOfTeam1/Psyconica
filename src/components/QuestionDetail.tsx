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


function fetchQuestionData(slug: {}) {
  return fetchDoc('questions', slug);
}

const MAX_LIKES = 100;

const QuestionDetail = () => {
  const [questionData, setQuestionData] = useState<{ title: string; answers: Answers[] } | null>(null);
  // const [likedAnswers, setLikedAnswers] = useState<string[]>([]);
  const params = useParams();
  const questionSlug: any = params.slug;
  const userId = useAppSelector((state) => state.auth.user?.id);

  const handleLikeClick = async (answerNum: any, answerLikes: string[]) => {
    if (!userId) {
      console.error("User ID is undefined.");
      return;
    }
    let updatedLikes;
    const isLiked = answerLikes.includes(userId);
    if (isLiked) {
      updatedLikes = answerLikes.filter(id => id !== userId);
      console.log(updatedLikes)

    } else {
      updatedLikes = [...answerLikes, userId];
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
            className={`text-green-500 mr-1 cursor-pointer ${answer.likes.includes(userId) ? 'text-green-700' : ''}`}
            onClick={() => handleLikeClick(answer.num, answer.likes)} />
          <span className="text-gray-500">{answer.likes.length}</span>
          <div style={{ flex: 1, marginLeft: '10px', marginRight: '10px' }}>
            <div style={{ height: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <div style={{ width: `${progressWidth}%`, height: '100%', backgroundColor: '#00b894', borderRadius: 'inherit' }}></div>
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
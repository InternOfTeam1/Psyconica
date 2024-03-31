"use client";
import { FaThumbsUp } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { ChangeEvent, useEffect, useState } from 'react';
import { Answers, QuestionData } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '../redux/hooks';
import { updateAnswerLikes, updateQuestion } from '@/lib/firebase/firebaseFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { openModal, closeModal } from '@/redux/slices/modalSlice';
import { nanoid } from '@reduxjs/toolkit';

function fetchQuestionData(slug: {}) {
  return fetchDoc('questions', slug);
}


const QuestionDetail = () => {
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const params = useParams();
  const questionSlug: any = params.slug;
  const userId = useAppSelector((state) => state.auth.user?.id);
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const MAX_LIKES = 100;
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const isModalOpen = useSelector((state: any) => state.modal.isModalOpen);

  const handleOpenModal = () => {
    dispatch(openModal());
  };

  // const handleCloseModal = () => {
  //   dispatch(closeModal());
  // };

  const handleLikeClick = async (answerNum: any, answerLikes: string[]) => {
    const isLiked = answerLikes.includes(userId);

    let updatedLikes;

    if (!userId) {
      handleOpenModal()

      console.error("User ID is undefined.");
      return;
    }

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


  const onAnswerChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>, answerNumber: number, field = 'title') => {
    const newValue = e.target.value;

    console.log(questionData)
    const answers = questionData?.answers;

    const changedAnswers = answers?.map(answer => answerNumber === answer.num ? { ...answer, [field]: newValue } : answer);

    setQuestionData({
      ...questionData,
      answers: changedAnswers ?? []
    })
  }


  const onAnswerAdd = () => {
    const answers: any = questionData?.answers;

    setQuestionData({
      ...questionData,
      answers: [...answers, {
        content: '',
        likes: [],
        num: nanoid(),
        title: ''
      }]
    })
  }


  const onSave = async () => {
    await updateQuestion(questionSlug, questionData)
  }

  const onAnswerDelete = (answerNum: number) => {
    const answers: any = questionData?.answers;

    const newAnswers = answers?.filter((answer: { num: number; }) => answer.num !== answerNum)

    setQuestionData({
      ...questionData,
      answers: newAnswers
    })
  }


  return (
    <div className="container mx-auto px-4 py-4 max-w-xl bg-white shadow-xl rounded-2xl">
      {questionData && (
        <>
          <h2 className="font-semibold bg-amber-300 text-gray-600 px-7 py-3 rounded-2xl leading-6 text-center xs:text-sm xs:px-3 sm:text-sm sm:px-4 md:text-base md:px-5 lg:text-lg lg:px-6 xl:text-lg xl:px-7">{questionData.title}</h2>
          {questionData.answers.map((answer: Answers, index: number) => {
            const progressWidth = (answer.likes.length / MAX_LIKES) * 100;
            return (
              <div key={index} className="mt-4 w-full">
                <div className="flex items-start mb-4">
                  <p className="font-semibold text-gray-600 mr-2">{index + 1}.</p>
                  {userRole === 'psy' ? (
                    <>
                      <div className='w-full'>
                        <h3 className="font-semibold text-gray-600 leading-6">
                          <input
                            type="text"
                            className='w-full'
                            value={answer.title}
                            onChange={(e) => onAnswerChange(e, answer.num)}
                            placeholder="Enter your answer"
                          />
                        </h3>
                        <p className="text-gray-500 text-sm mt-2 w-full">
                          <textarea
                            value={answer.content}
                            className='w-full h-12'
                            onChange={(e) => onAnswerChange(e, answer.num, 'content')}
                            placeholder="Enter your description"
                          />
                        </p>
                      </div>
                      <div className='cursor-pointer' onClick={() => onAnswerDelete(answer.num)}>
                        <MdClose />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='w-full'>
                        <h3 className="font-semibold text-gray-600 leading-6">
                          {answer.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-2 w-full">
                          {answer.content}
                        </p>
                      </div>
                    </>
                  )}
                </div>


                <div className="flex items-center">
                  <FaThumbsUp
                    className={`text-green-500 mr-1 cursor-pointer ${answer.likes.includes(userId) ? 'text-green-700' : ''}`}
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
      )
      }


      {userRole === 'psy' ? (
        <>
          <button className="inline-block mt-4 px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600 xs:text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm"
            onClick={onAnswerAdd}>Add Answer</button>
          <button className="inline-block mt-4 px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600 xs:text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm"
            onClick={onSave}>Save </button>
        </>
      ) : null}

      <br />

      <Link href={HOME_ROUTE}>
        <button className="inline-block mt-4 px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600 xs:text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm">
          Вернуться на главную
        </button>
      </Link>

    </div >
  );
};

export default QuestionDetail;
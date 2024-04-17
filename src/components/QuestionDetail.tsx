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
import { updateAnswerLikes, updateQuestion, updateComment } from '@/lib/firebase/firebaseFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { openModal, closeModal } from '@/redux/slices/modalSlice';
import { nanoid } from '@reduxjs/toolkit';
import VideosFetcher from './VideosFetcher';
import { DiVim } from 'react-icons/di';

function fetchQuestionData(slug: {}) {
  return fetchDoc('questions', slug);
}

const QuestionDetail = () => {
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [answerForComments, setAnswerForComments] = useState<any>(null);
  const [lastCommentId, setLastCommentId] = useState<any>(null);
  const params = useParams();
  const questionSlug: any = params.slug;
  const userId = useAppSelector((state) => state.auth.user?.id);
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const MAX_LIKES = 100;
  const dispatch: AppDispatch = useDispatch();

  const handleOpenModal = () => {
    dispatch(openModal());
  };

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
    document.title = `${questionSlug}`;
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

  const onCommentAdd = (answerIndex: number) => {
    if (userId) {
      setAnswerForComments(answerIndex)
      const commentId = nanoid();
      setLastCommentId(commentId)
      const comments = questionData?.comments;

      setQuestionData(currentData => ({
        ...currentData,
        answers: currentData?.answers || [],
        comments: [
          ...(currentData?.comments || []),
          {
            content: '',
            num: commentId,
            answerId: answerIndex,
          }
        ]
      }));

    } else {
      handleOpenModal()
    }




  }

  const onCommentChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>, commentNumber: string) => {
    const newValue = e.target.value;

    setQuestionData(currentData => {
      const updatedComments = currentData?.comments?.map(comment =>
        commentNumber === comment.num.toString() ? { ...comment, content: newValue } : comment
      ) ?? [];

      return {
        ...currentData,
        answers: currentData?.answers ?? [],
        comments: updatedComments
      };
    });

  }

  const onCommentSave = async () => {
    await updateComment(questionSlug, questionData)

    setAnswerForComments(null)
    setLastCommentId(null)
  }

  const onCommentDelete = async (commentNum: any) => {
    const comments: any = questionData?.comments;

    const newComments = comments?.filter((comment: { num: any }) => comment.num !== commentNum)

    const updatedQuestion = {
      ...questionData,
      answers: questionData?.answers ?? [],
      comments: newComments
    }

    setQuestionData(updatedQuestion)
    await updateComment(questionSlug, updatedQuestion)
  }

  const sortedAnswers = questionData?.answers?.sort((a, b) => b.likes.length - a.likes.length) || [];

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl mt-[-30px]">
    <div className="flex flex-wrap -mx-1 lg:-mx-1">
      <div className=" px-1 lg:mb-0 mt-[-1px] sm:ml-[75px] md:ml-[100px] lg:ml-[30px] sm:w-3/4 md:w-3/4 lg:w-[250px] xl:w-[300px]">
        <VideosFetcher />
      </div>
      <div className="container mx-auto px-1 py-2 bg-white shadow-xl rounded-2xl w-full lg:ml-[40px] sm:w-3/4 md:w-3/4 lg:w-[700px] xl:w-[780px] " style={{ maxWidth: '100%' }}>  
          {questionData && (
          <>
            <h2 className="font-semibold bg-amber-300 text-gray-600 px-7 py-3 rounded-2xl leading-6 text-center">{questionData.title}</h2>
              {sortedAnswers.map((answer: Answers, index: number) => {
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


                    <div className='font-semibold text-gray-600 leading-6 mt-2'>
                      Комментарии:
                      <div>
                        {
                          questionData?.comments?.filter(comment => comment.answerId === answer.num && comment.num !== lastCommentId).map((comment, index) => (
                            <div key={index} className='flex font-semibold text-gray-500 text-sm leading-6'>
                              {index + 1}.
                              <div className='ml-3'>{comment.content}</div>
                              <div className='cursor-pointer ml-3 mt-1' onClick={() => onCommentDelete(comment.num)}>
                                <MdClose />
                              </div>
                            </div>

                          ))
                        }
                      </div>
                    </div>


                    <>
                      {answerForComments === answer.num ?
                        <>
                          <input
                            type="text"
                            className='w-full font-semibold text-gray-500 text-sm leading-6 mt-2'
                            onChange={(e) => onCommentChange(e, lastCommentId)}
                            placeholder=" Текст комментария..."
                          />
                          <button className='text-gray-600 hover:text-neutral-600 hover:text-gray-800 uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm mt-5 px-2'
                            onClick={() => onCommentSave()}>Отправить</button>
                        </>
                        : (<button className='text-gray-600 hover:text-neutral-600 hover:text-gray-800 uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm mt-5 px-2'
                          onClick={() => onCommentAdd(answer.num)}>Комментировать</button>)}
                    </>




                    <hr className="my-4 border-gray-400" />
                  </div>
                );
              })}
            </>
          )
          }


          {userRole === 'psy' ? (
            <>
              <button className='text-gray-600 hover:text-neutral-600 hover:text-gray-800 uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm mt-5 px-2'
                onClick={onAnswerAdd}>Ответить</button>
              <button className='text-gray-600 hover:text-neutral-600 hover:text-gray-800 uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm mt-5 px-2'
                onClick={onSave}>Опубликовать</button>
            </>
          ) : null}

          <br />


          <Link href={HOME_ROUTE}>
            <button className="inline-block mt-4 px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600 xs:text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm">
              Вернуться на главную
            </button>
          </Link>

        </div >
      </div>
    </div>

  );
};

export default QuestionDetail;
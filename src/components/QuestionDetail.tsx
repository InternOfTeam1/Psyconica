"use client";
import { FaThumbsUp } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { ChangeEvent, useEffect, useState } from 'react';
import { Answers, QuestionData } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useParams } from 'next/navigation';
import { useAppSelector } from '../redux/hooks';
import { updateAnswerLikes, updateQuestion, updateComment } from '@/lib/firebase/firebaseFunctions';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { openModal } from '@/redux/slices/modalSlice';
import { nanoid } from '@reduxjs/toolkit';
import VideosFetcher from './VideosFetcher';
import icon from '../../public/iconPsy.png';
import Image from 'next/image';
import { FaPen } from "react-icons/fa";

function fetchQuestionData(slug: {}) {
  return fetchDoc('questions', slug);
}

const QuestionDetail = () => {
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [answerForComments, setAnswerForComments] = useState<any>(null);
  const [newAnswer, setNewAnswer] = useState<any>(null);
  const [lastCommentId, setLastCommentId] = useState<any>(null);
  const params = useParams();
  const questionSlug: any = params.slug;
  const userId = useAppSelector((state) => state.auth.user?.id);
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const userName = useAppSelector((state) => state.auth.user?.name);
  const userPhoto = useAppSelector((state) => state.auth.user?.photo);
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
    fetchData();
  }, [questionSlug]);

  useEffect(() => {
    document.title = `${questionData?.title}`;
  }, [questionData])

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
    setNewAnswer({
      content: '',
      likes: [],
      num: nanoid(),
      title: ''
    })
  }

  const onNewAnswerChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setNewAnswer({
      ...newAnswer,
      title: newValue
    })
  }


  const onNewAnswerSave = async () => {
    const answers: any = questionData?.answers;

    const nameToAdd = userRole === 'psy' ? userName : 'Psy';

    const updatedNewAnswer = {
      ...newAnswer,
      name: nameToAdd,
      psyPhoto: userRole === 'psy' ? userPhoto : '/psy_avatar.jpg',
    };

    const newQuestionData = {
      ...questionData,
      answers: [...answers, updatedNewAnswer]
    }

    setQuestionData(newQuestionData)
    setNewAnswer(null)
    await updateQuestion(questionSlug, newQuestionData);
  }


  const onSave = async () => {
    await updateQuestion(questionSlug, questionData)
  }

  const onAnswerDelete = async (answerNum: number) => {
    const answers: any = questionData?.answers;

    const newAnswers = answers?.filter((answer: { num: number; }) => answer.num !== answerNum)
    const newQuestionData = {
      ...questionData,
      answers: newAnswers
    }

    setQuestionData(newQuestionData)
    await updateQuestion(questionSlug, newQuestionData);
  }

  const onCommentAdd = (answerIndex: number) => {
    debugger
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
            name: userName,
            photo: userPhoto,
            userId,
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
    <div className="container mx-auto px-4 py-4 max-w-7xl mt-[-40px]">
      <div className="flex flex-wrap -mx-1 xs:flex-col-reverse lg:flex-row lg:-mx-1">
        <div className="w-full lg:w-1/4 px-1 lg:mb-0">
          <VideosFetcher />
        </div>
        <div className="container ml-5 px-2 py-4 max-w-3xl bg-white shadow-xl rounded-2xl " style={{ maxWidth: '820px' }}>
          {questionData && (
            <>
              <h2 className="font-semibold bg-amber-300 text-gray-600 px-7 py-3 rounded-2xl leading-6 text-center xs:text-sm xs:px-3 sm:text-sm sm:px-4 md:text-base md:px-5 lg:text-lg lg:px-6 xl:text-xl xl:px-7">{questionData.title}</h2>

              {userRole === 'psy' ? (
                newAnswer ?
                  <>
                    <input
                      type="text"
                      className='w-1/2 font-semibold text-gray-500 text-md leading-6 mt-2'
                      onChange={onNewAnswerChange}
                      placeholder=" Текст ответа..."
                    />
                    <button
                      className='text-white bg-gray-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 uppercase shadow-lg'
                      onClick={onNewAnswerSave}
                    >
                      Опубликовать
                    </button>
                  </>
                  : (<button className='text-gray-600 hover:text-neutral-600 hover:text-gray-800 uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sn mt-5 ml-3 px-2'
                    onClick={onAnswerAdd}>Ответить</button>)
              ) : null}

              {sortedAnswers.map((answer: Answers, index: number) => {
                const progressWidth = (answer.likes.length / MAX_LIKES) * 100;
                return (
                  <div key={index} className="mt-4 w-full ">

                    <div className="flex items-center">
                      {answer.psyPhoto && (
                        <img
                          src={answer.psyPhoto}
                          alt="User Avatar"
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                      )}
                      <p className="font-semibold text-black flex items-center bg-gray-200 rounded-2xl p-1">
                        <span className="mr-1">{answer.name}</span>
                        <Image src={icon} alt="Psy Icon" width={20} height={20} />
                      </p>
                    </div>

                    <div className="flex items-start mb-4">

                      <p className="font-semibold text-gray-500 mt-1 ml-1 mr-1 px-1 xs:text-sm  sm:text-sm md:text-base lg:text-lg xl:text-xl ">{index + 1}.</p>
                      {userRole === 'psy' ? (
                        <>
                          <div className='w-full'>
                            <h3 className="font-semibold text-gray-600 leading-6">
                              <input
                                type="text"
                                className='w-1/2 font-semibold text-gray-500 text-md leading-6 mt-1 px-1 xs:text-sm  sm:text-sm md:text-base lg:text-lg  xl:text-xl '
                                value={answer.title}
                                onChange={(e) => onAnswerChange(e, answer.num)}
                                placeholder="Текст ответа"
                              />

                            </h3>
                          </div>
                          <button className='text-white bg-gray-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 uppercase shadow-lg' onClick={onSave}>Изменить</button>
                          <div className='cursor-pointer' onClick={() => onAnswerDelete(answer.num)}>
                            <MdClose />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='w-full'>
                            <h3 className="font-semibold text-gray-600 leading-6 sm:text-md md:text-lg lg:text-xl">
                              {answer.title}
                            </h3>
                            <p className="font-semibold text-gray-600 mt-2 pr-5 leading-5 w-full sm:text-sm md:text-md lg:text-lg">
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
                        <div className=" h-2.5 border border-gray-300 rounded">
                          <div className=" h-full bg-teal-400 rounded" style={{ width: `${progressWidth}%` }}></div>
                        </div>
                      </div>
                    </div>


                    <div className='font-semibold  text-gray-800 leading-6 mt-2 ml-5'>
                      <p className='text-lg'>Комментарии</p>
                      <div>
                        {
                          questionData?.comments?.filter(comment => comment.answerId === answer.num && comment.num !== lastCommentId).map((comment, index) => (
                            <div key={index} className="flex flex-col p-3 bg-white shadow rounded-lg mb-3 mt-2">
                              <div className="flex items-center space-x-3 ">
                                <img src={comment.photo || '/default_avatar.jpg'} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex flex-col flex-grow">
                                  <p className="text-xs font-semibold text-gray-800">{comment?.userId === userId ? 'Вы' : comment?.name}</p>
                                  <p className="text-md text-gray-600 mt-1">{comment.content}</p>
                                </div>
                                {userRole === 'user' || 'psy' && (
                                  <>
                                    <FaPen className='text-grey-500 mr-1 cursor-pointer' />
                                    <div className='cursor-pointer' onClick={() => onCommentDelete(comment.num)}>
                                      <MdClose />
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>

                    {userRole === 'user' || 'psy' ? (
                      <>
                        {answerForComments === answer.num ?
                          <>
                            <input
                              type="text"
                              className='w-1/2 font-semibold text-gray-500 text-md leading-6 mt-2'
                              onChange={(e) => onCommentChange(e, lastCommentId)}
                              placeholder=" Текст комментария..."
                            />
                            <button
                              className='text-white bg-gray-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 uppercase shadow-lg'
                              onClick={() => onCommentSave()}
                            >
                              Отправить
                            </button>
                          </>
                          : (<button className='text-gray-600 hover:text-neutral-600 hover:text-gray-800 uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sn mt-5 ml-3 px-2'
                            onClick={() => onCommentAdd(answer.num)}>Комментировать</button>)}
                      </>
                    ) : null}
                    <hr className="my-4 border-gray-400" />
                  </div>
                );
              })}
            </>
          )
          }

          <br />

        </div >

      </div>
      <div className='text-center'>
        <Link href={HOME_ROUTE}>
          <button className="inline-block mt-4 mb-10 px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple hover:shadow-lg focus:outline-none hover:bg-blue-600">
            Вернуться на главную
          </button>
        </Link>
      </div>
    </div>

  );
};

export default QuestionDetail;
"use client";
import { VideoBlock } from "@/components/VideoBlock";
import { FaThumbsUp } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Answers, QuestionData, Users, Video } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useParams } from 'next/navigation';
import { useAppSelector } from '../redux/hooks';
import { updateAnswerLikes, updateQuestion, updateComment, updateUser, getVideosById } from '@/lib/firebase/firebaseFunctions';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { openModal } from '@/redux/slices/modalSlice';
import { nanoid } from '@reduxjs/toolkit';
import icon from '../../public/iconPsy.png';
import Image from 'next/image';
import { FaPen } from "react-icons/fa";
import { addDocumentWithSlug } from "@/lib/firebase/firebaseAdddoc";
import { useRouter } from 'next/navigation';
import { getUserData } from '@/lib/firebase/firebaseFunctions';


function fetchQuestionData(slug: any) {
  return fetchDoc('questions', slug);
}


type Props = {
  rawData: any
}



const QuestionDetail = (props: Props) => {
  const { rawData } = props
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [answerForComments, setAnswerForComments] = useState<any>(null);
  const [newAnswer, setNewAnswer] = useState<any>(null);
  const [lastCommentId, setLastCommentId] = useState<any>(null);
  const [editingAnswerNum, setEditingAnswerNum] = useState<number | null>(null);
  const [editedAnswer, setEditedAnswer] = useState<string>('');
  const [editingCommentNum, setEditingCommentNum] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState<string>('');
  const [videos, setVideos] = useState([] as Video[]);
  const params = useParams();
  const questionSlug: any = params.slug;
  const userId = useAppSelector((state) => state.auth.user?.id);
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const userName = useAppSelector((state) => state.auth.user?.name);
  const user = useAppSelector((state) => state.auth.user);
  const [userPhoto, setUserPhoto] = useState('/default_avatar.jpg');
  const MAX_LIKES = 100;
  const dispatch: AppDispatch = useDispatch();
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();


  const handleOpenModal = () => {
    dispatch(openModal());
  };

  useEffect(() => {
    if (userId) {
      getUserData(userId).then((userData) => {
        setUserData(userData);
        setUserPhoto(userData.photo);
      });
    }
  }, [userId]);


  fetchPhoto();


  function fetchPhoto() {
    getUserData(userId).then((userData) => {
      setUserPhoto(userData.photo);
      updateExistingData(userData.photo, userData.name);
    });
  }
  
  fetchPhoto();
  
  function updateExistingData(photo: string, name: string) {
    if (!questionData) return;
  
    const updatedQuestionData = {
      ...questionData,
      answers: questionData.answers.map((answer) =>
        answer.userId === userId ? { ...answer, psyPhoto: photo, name: name } : answer
      ),
      comments: questionData?.comments?.map((comment) =>
        comment.userId === userId ? { ...comment, photo: photo } : comment
      ),
    };
  
    setQuestionData(updatedQuestionData);
    updateQuestion(questionSlug, updatedQuestionData);
  }



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

    } else {
      updatedLikes = [...answerLikes, userId];
    }
    try {
      await updateAnswerLikes(answerNum, updatedLikes, questionSlug);
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


  const handleClick = async (user: string, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!userId) {
      handleOpenModal()

      console.error("User ID is undefined.");
      return;
    }

    try {
      const fetchedUserData = await fetchDoc('users', user);
      setUserData(fetchedUserData);
      await router.push(`/profile/${user}`);

    } catch (error) {
      console.error('Ошибка навигации:', error);
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


  const onAnswerAdd = () => {
    setNewAnswer({
      content: '',
      likes: [],
      num: nanoid(),
      title: '',
      userId,
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
    try {
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


      if (userRole === 'psy') {
        const userDocs = await fetchDoc('users', userId) as unknown as Users;

        if (userDocs) {
          const answeredQuestions = userDocs.answeredQuestions || [];
          const questionTitle = questionData?.title;


          if (
            questionTitle &&
            questionSlug &&
            !answeredQuestions.some((q: { title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode; slug: any; }) => q.title === questionTitle && q.slug === questionSlug)
          ) {
            const updatedUserDoc = {
              ...userDocs,
              answeredQuestions: [...answeredQuestions, { title: questionTitle, slug: questionSlug }]
            }
            await addDocumentWithSlug('users', updatedUserDoc, 'userId');
          }
        };
      }
    } catch (error) {
      console.error("Error saving new answer:", error);

    }
  };

  const onAnswerDelete = async (answerNum: number) => {
    const answers: any = questionData?.answers;

    const newAnswers = answers?.filter((answer: { num: number; }) => answer.num !== answerNum)
    const newQuestionData = {
      ...questionData,
      answers: newAnswers
    }

    setQuestionData(newQuestionData)
    await updateQuestion(questionSlug, newQuestionData);

    const userDocs = await fetchDoc('users', userId) as unknown as Users;

    if (userDocs) {

      const answeredQuestions = userDocs.answeredQuestions || [];

      const updatedAnsweredQuestions = answeredQuestions.filter((question: { slug: string; title: string }) => {
        return !(question.slug === questionSlug && question.title === newQuestionData.title)
      })

      await updateUser(userId, { answeredQuestions: updatedAnsweredQuestions })

    }
    else {
      console.error('user document not found')
    }

  }

  const onAnswerEdit = (answerNum: number) => {
    setEditingAnswerNum(answerNum);
    const currentAnswer = questionData?.answers?.find(answer => answer.num === answerNum);
    if (currentAnswer) {
      setEditedAnswer(currentAnswer.title);
    }
  };

  const onAnswerSave = async (answerNum: number) => {
    const updatedAnswers = questionData?.answers?.map(answer =>
      answer.num === answerNum ? { ...answer, title: editedAnswer } : answer
    );
    const newQuestionData = {
      ...questionData,
      answers: updatedAnswers || []
    }

    setQuestionData(newQuestionData);
    setEditingAnswerNum(null);

    await updateQuestion(questionSlug, newQuestionData);
  };

  const onAnswerChange = (e: ChangeEvent<HTMLInputElement>, answerNumber: number) => {
    setEditedAnswer(e.target.value);
  };

  const onCommentAdd = (answerIndex: number) => {

    if (userId) {
      setAnswerForComments(answerIndex)
      const commentId = nanoid();
      setLastCommentId(commentId)
    } else {
      handleOpenModal()
    }
  }


  const onCommentEdit = (commentNum: string, commentText: string) => {
    setEditingCommentNum(commentNum);

    setEditedComment(commentText);
  };

  const onCommentSend = async (commentNum: string) => {

    const updatedComments = questionData?.comments?.map(comment =>
      comment.num === commentNum ? { ...comment, content: editedComment } : comment
    );

    const newQuestionData = {
      ...questionData,
      comments: updatedComments || []
    };

    setQuestionData(newQuestionData as QuestionData)
    setEditingCommentNum(null);

    await updateComment(questionSlug, newQuestionData)
  };

  const onCommentCreate = async (answerNum: string) => {
    const newComment = {
      num: lastCommentId,
      answerId: answerNum,
      content: editedComment,
      name: userName,
      photo: userPhoto,
      userId,
    }

    const newQuestionData = {
      ...questionData,
      comments: questionData?.comments?.length ? [...questionData?.comments, newComment] : [newComment]
    };

    setQuestionData(newQuestionData as QuestionData)
    setEditingCommentNum(null);
    setEditedComment('')
    setAnswerForComments(null)
    setLastCommentId(null)

    await updateComment(questionSlug, newQuestionData)
  };

  const onCommentChange = (e: ChangeEvent<HTMLInputElement>, commentNum: string) => {
    setEditedComment(e.target.value);
  };

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

  const addVideo = useCallback((newVideo: Video) => {
    setVideos((prevState) => {
      return [...prevState, newVideo]
    })
  }, [])

  const sortedAnswers = questionData?.answers?.sort((a, b) => b.likes.length - a.likes.length) || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 mt-[-40px]">
      <div className="flex flex-wrap -mx-4 xs:flex-col-reverse xs:px-5 sm:px-5 md:px-5 lg:px-5 lg:flex-row xl:px-5">
        <div className="w-full lg:w-1/4 px-1 lg:mb-0">
          <VideoBlock videos={rawData.video} userRole={userRole} updateVideo={addVideo} />
        </div>
        <div className="w-full mx-auto mb-5 lg:w-3/4 lg:ml-0 xl:ml-0 px-4 py-4 bg-white shadow-xl rounded-2xl" style={{ maxWidth: '850px' }}>
          {questionData && (
            <>
              <h2 className="font-semibold bg-amber-300 text-gray-600 px-7 py-3 rounded-2xl leading-6 text-center xs:text-sm xs:px-3 sm:text-sm sm:px-4 md:text-base md:px-5 lg:text-lg lg:px-6 xl:text-xl xl:px-7">{questionData.title}</h2>

              {userRole === 'psy' ? (
                newAnswer ?
                  <>
                    <input
                      type="text"
                      className='w-1/2 font-semibold text-gray-500 text-md leading-6 mt-5 ml-5 mr-2'
                      onChange={onNewAnswerChange}
                      placeholder="Текст ответа..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onNewAnswerSave();
                        }
                      }}
                    />
                    <button
                      className='text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs xs:normal-case xs:mt-3 xs:ml-0 sm:text-xs sm:normal-case sm:mt-3 sm:ml-0 md:text-xs lg:text-xs lg:uppercase xl:text-xs xl:uppercase my-5 mt-5 ml-1'
                      onClick={onNewAnswerSave}
                    >
                      опубликовать
                    </button>
                  </>
                  : (<button className='text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs xs:normal-case xs:mt-3 xs:ml-0 sm:text-xs sm:normal-case sm:mt-3 sm:ml-0 md:text-xs lg:text-xs lg:uppercase xl:text-xs xl:uppercase mt-5 ml-3'
                    onClick={onAnswerAdd}>ответить</button>)
              ) : null}

              {sortedAnswers.map((answer: Answers, index: number) => {
                const progressWidth = (answer.likes.length / MAX_LIKES) * 100;
                console.log(answer, 'fghjkl;');

                return (
                  <div key={index} className="mt-4 w-full ">

                    <div onClick={(e) => handleClick(answer.userId, e)}

                      className="flex items-center cursor-pointer">

                      {answer.psyPhoto && (
                        <img src={answer.psyPhoto || '/default_avatar.jpg'} alt="User Avatar" className="w-10 h-10 rounded-full object-cover mr-3" />
                      )}

                      <p className="font-semibold text-black flex items-center bg-gray-200 rounded-2xl p-1">
                        <span className="mr-1">{answer.name}</span>
                        <Image src={icon} alt="Psy Icon" width={20} height={20} />
                      </p>
                    </div>

                    <div className="flex items-start mb-4">

                      <p className="font-semibold text-gray-500 mt-2 ml-1 mr-1 px-1 xs:text-md sm:text-lg md:text-lg lg:text-xl xl:text-xl">{index + 1}.</p>
                      {editingAnswerNum === answer.num ? (
                        <>
                          <div className='w-full'>
                            <h3 className="font-semibold text-black text-md leading-6 xs:text-base sm:text-base md:text-base lg:text-lg  xl:text-xl ">
                              <input
                                type="text"
                                className='w-10/12 font-semibold text-gray-500 text-md leading-6 mt-2'
                                value={editedAnswer}
                                onChange={(e) => onAnswerChange(e, answer.num)}
                                placeholder="Текст ответа"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    onAnswerSave(answer.num);
                                  }
                                }}
                              />
                            </h3>
                          </div>
                          <button
                            className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs xs:normal-case xs:ml-0 sm:text-xs sm:normal-case sm:mt-3 sm:ml-0 md:text-xs lg:text-xs lg:uppercase xl:text-xs xl:uppercase mt-1 ml-1"
                            onClick={() => onAnswerSave(answer.num)}
                          >
                            сохранить
                          </button>
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold text-gray-600 leading-6 sm:text-md md:text-lg lg:text-xl mt-2">
                            {answer.title}
                          </h3>
                          {((userRole === 'psy' && answer.userId === userId) || (userRole !== 'psy' && answer.userId === userId)) && (
                            <>
                              <FaPen
                                className="cursor-pointer mt-1 mr-3 ml-auto"
                                onClick={() => onAnswerEdit(answer.num)}
                              />
                              <div className='cursor-pointer mt-1 mr-3' onClick={() => onAnswerDelete(answer.num)}>
                                <MdClose />
                              </div>
                            </>
                          )}
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
                      <p className='text-lg uppercase font-semibold xs:text-base xs:normal-case xs:ml-0 sm:text-base sm:normal-case sm:ml-0 md:text-base lg:text-base lg:normal-case xl:text-lg xl:normal-case'>Комментарии</p>
                      <div>
                        {
                          questionData?.comments?.filter(comment => comment.answerId === answer.num && comment.num !== lastCommentId).map((comment: any, index: number) => (
                            <div key={index} className="flex flex-col p-3 bg-white shadow rounded-lg mb-3 mt-2">
                              <div className="flex items-center space-x-3 ">
                                {editingCommentNum === comment.num ? (
                                  <>
                                    <input
                                      type="text"
                                      className="w-10/12 font-semibold text-gray-500 text-md leading-6"
                                      value={editedComment}
                                      onChange={(e) => onCommentChange(e, comment.num)}
                                      placeholder="Текст комментария"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          onCommentSend(comment.num);
                                        }
                                      }}
                                    />
                                    <button
                                      className="text-white bg-gray-500 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 font-semibold rounded-2xl text-sm py-1 px-2 text-center mt-2 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 uppercase shadow-lg ml-auto"
                                      onClick={() => onCommentSend(comment.num)}
                                    >
                                      Сохранить
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <img src={comment.photo || '/default_avatar.jpg'} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <div className="flex flex-col flex-grow">
                                      <p className="text-xs font-semibold text-gray-800">{comment?.userId === userId ? 'Вы' : comment?.name}</p>
                                      <p className="text-md text-gray-600 mt-1">{comment.content}</p>
                                    </div>
                                    {((userRole === 'psy' && comment.userId === userId) || (userRole !== 'psy' && comment.userId === userId)) && (
                                      <>
                                        <FaPen
                                          className='cursor-pointer mr-3'
                                          onClick={() => onCommentEdit(comment.num, comment.content)}
                                        />
                                        <div className='cursor-pointer mt-1 mr-5' onClick={() => onCommentDelete(comment.num)}>
                                          <MdClose />
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
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
                            className='w-1/2 font-semibold text-gray-500 text-md leading-6 mt-3 ml-4 mr-2'
                            onChange={(e) => onCommentChange(e, lastCommentId)}
                            placeholder=" Текст комментария..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                onCommentCreate(String(answer.num));
                              }
                            }}
                          />
                          <button
                            className='text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs xs:normal-case xs:mt-3 xs:ml-0 sm:text-xs sm:normal-case sm:mt-3 sm:ml-0 md:text-xs lg:text-xs lg:uppercase xl:text-xs xl:uppercase my-5 mt-4 ml-1'
                            onClick={() => onCommentCreate(String(answer.num))}
                          >
                            отправить
                          </button>
                        </>
                        : (<button className='text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs xs:normal-case xs:mt-3 sm:text-xs sm:normal-case sm:mt-3 md:text-xs lg:text-xs lg:uppercase xl:text-xs xl:uppercase my-5 mt-5 ml-4'
                          onClick={() => onCommentAdd(answer.num)}>комментировать</button>)}
                    </>

                    <hr className="my-4 border-gray-400" />
                  </div>
                );
              })}
            </>
          )
          }

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

"use client";
import { fetchAllUsers, fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { getUserData, getVideosById, updateUser } from '@/lib/firebase/firebaseFunctions';
import { Comments } from '@/interfaces/collections';
import React, { ChangeEventHandler, useEffect, useState } from 'react';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import PsychologistDashboard from './PsychologistVideoManager';
import { FaCheck, FaPen, FaSpinner } from 'react-icons/fa';
import Head from 'next/head'
import { MdClose } from 'react-icons/md';
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { useAppSelector } from '../redux/hooks';
import { useRouter } from 'next/navigation';
import RatingStars from './Rating';
import { uploadImageToStorage } from '@/lib/firebase/firebaseConfig';
import { sendTelegramMessage } from '../app/script/telegram';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { falseToggle, trueToggle } from '@/redux/slices/toggleSlice';
interface User {
  id: string;
  photo?: string;
}

export function fetchUserData(slug: any) {
  return fetchDoc('users', slug);
}

const PsyAccount = () => {
  const [userData, setUserData] = useState<any>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<Comments[]>([]);
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState<string>('');
  const [editedAbout, setEditedAbout] = useState<string>('');
  const [editedContact, setEditedContact] = useState<string>('');
  const [editedSlogan, setEditedSlogan] = useState<string>('');
  const [editedExpert, setEditedExpert] = useState<string>('');
  const [editedName, setEditedName] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const userName = useAppSelector((state) => state.auth.user?.name);
  const [userPhoto, setUserPhoto] = useState('/default_avatar.jpg');
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const userEmail = useAppSelector((state) => state.auth.user?.mail);
  const params = useParams();
  const userSlug: any = params.slug;
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [showAbout, setShowAbout] = useState(true);
  const [showContact, setShowContact] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [messageStatus, setMessageStatus] = useState<string | null>(null);
  const [loadStatus, setLoadStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    fetchAllUsers().then((usersData) => {
      setAllUsers(usersData);
    });
  }, []);

  const getCommentPhoto = (commentUserId: string) => {
    return allUsers.find((item) => item.id.toLowerCase() === commentUserId.toLowerCase())?.photo;
  };


  useEffect(() => {
    async function fetchUserData(userId: any) {
      try {
        const fetchedUserData: any = await fetchDoc('users', userSlug);
        setUserData(fetchedUserData);
        setComments(fetchedUserData?.comments ?? [])
        setRating(fetchedUserData.averageRating || 0);
        setEditedAbout(fetchedUserData.aboutUser || '');
        setEditedContact(fetchedUserData.contactUser || '');
        setEditedSlogan(fetchedUserData.slogan || '');
        setEditedExpert(fetchedUserData.expert || '');
        setEditedName(fetchedUserData.name || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    if (userSlug) {
      fetchUserData(userSlug);
    }

  }, [userSlug]);

  useEffect(() => {
    if (userId) {
      getUserData(userId).then((userData) => {
        setUserPhoto(userData.photo || '/defaultPhoto.jpg');
        setIsLoading(false);
      });
    }
  }, [userId]);

  const handleSaveChanges = async () => {
    try {
      let newImageUrl = userData?.photo;

      if (image) {
        try {
          dispatch(trueToggle());
          setLoadStatus('Изображение загружается. Пожалуйста, подождите...');
          const imageUrl = await uploadImageToStorage(image);
          if (imageUrl) {
            newImageUrl = imageUrl;
            await updateUser(userSlug, { photo: imageUrl });
            setUserData((prevUserData: any) => ({
              ...prevUserData,
              photo: imageUrl
            }));

            setImageUrl(imageUrl);
            dispatch(falseToggle());
            setLoadStatus('Изображение загружено.');

            setTimeout(() => {
              setLoadStatus(null);
            }, 3000);
          }
        } catch (error) {
          console.error('Ошибка при обновлении фотографии:', error);
          return
        }

      }
      const updatedUserData = {
        aboutUser: editedAbout,
        contactUser: editedContact,
        slogan: editedSlogan,
        expert: editedExpert,
        name: editedName,
        photo: newImageUrl,
      };

      await updateUser(userSlug, updatedUserData);

      setUserData({
        ...userData,
        ...updatedUserData,
      });

      updateCommentsData(imageUrl || userData?.photo, editedName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsSmallScreen(screenWidth <= 768);
      setShowAbout(screenWidth > 640);
      setShowContact(screenWidth > 640);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleComment = async () => {
    if (!commentText.trim()) return;

    const newComment: Comments = {
      id: Math.random().toString(36).substring(7),
      content: commentText,
      name: userName,
      photo: userPhoto || '/default_avatar.jpg',
      userId,
    };
    const newCommentsArray = [...comments, newComment]

    setComments(newCommentsArray);
    setCommentText('');
    await updateUser(userSlug, {
      ...userData,
      comments: newCommentsArray
    })
  };


  const handleEditComment = async () => {
    if (!editedCommentText.trim() || !editCommentId) return;

    const updatedComments = comments.map(comment => {
      if (comment.id === editCommentId) {
        return { ...comment, content: editedCommentText };
      }
      return comment;
    });

    setComments(updatedComments);
    setEditCommentId(null);
    setEditedCommentText('');
    await updateUser(userSlug, {
      ...userData,
      comments: updatedComments
    })
  };

  const handleDeleteComment = async (id: string) => {
    const updatedComments = comments.filter(comment => comment.id !== id);
    setComments(updatedComments);
    try {
      await updateUser(userSlug, { comments: updatedComments });
    } catch (error) {
      console.error('Ошибка при удалении комментария:', error);
    }
  };

  function updateCommentsData(photo: string, name: string) {
    if (!comments || !comments.length) return;

    const updatedComments = comments.map(comment =>
      comment.userId === userId ? { ...comment, name: name, photo: photo } : comment
    );

    setComments(updatedComments);
  }


  const handleClick = async (url: string) => {


    if (userData?.answeredQuestions && userData.answeredQuestions.length > 0) {
      const questionSlugs = `/questions/${url}`;
      try {
        await router.push(questionSlugs);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }


  };

  const handleUpdateRating = async (newRating: number) => {
    try {
      const ratingId = new Date().toISOString();
      await updateUser(userSlug, { ratings: { [ratingId]: newRating } });
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };


  const handleSendMessage = async (psyName: any, email: any) => {
    try {
      await sendTelegramMessage(userName, userEmail, psyName);
      setMessageStatus('Уведомление успешно отправлено в Telegram психолога.');
    } catch (error) {
      setMessageStatus(`Психолог не может получать уведомления. Пожалуйста, пишите на почтовый адрес: ${email}`);
    }
  };

  const onChangeImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };




  return (
    <>
      <Head>
        <title>{editedName}</title>
        <meta name="description" content={editedAbout} />
        <meta property="og:title" content={editedName} />
        <meta property="og:description" content={editedAbout} />
        <meta property="og:image" content={imageUrl || userData?.photo || '/opengraph-image.png'} />
        <meta property="og:url" content={`https://psyconica.vercel.app/${userSlug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={imageUrl || userData?.photo || '/opengraph-image.png'} />
      </Head>
      <div className="container mx-auto px-4 py-4 max-w-7xl mt-[-40px] justify-center ">
        <div className="flex flex-wrap -mx-1 lg:-mx-1 xs:mx-1 s:mx-2 md:mx-3 ">
          <div className="w-full md:mt-3 xl:mt-0 lg:w-4/4 xl:w-1/4 px-1 lg:mb-0 order-last  tablet:order-last xl:order-first ">
            {userData && <PsychologistDashboard />}
          </div>
          <div className="container  mx-auto mt-[-1px] md:ml-[20px]  lg:ml-[40px] xl:ml-0 sm:mx-2 md:mx-1 lg:mx-1 px-2 py-4 max-w-3xl bg-white shadow-xl rounded-2xl xs:container-min card-small xl:w-[600px] containerPsy-laptop containerPsy-laptop-small " >
            {
              userData && (
                <>
                  <div className="text-center mb-5 w-full">
                    <p className=' flex items-center justify-start bg-amber-300 pl-6 py-1 rounded-2xl text-center text-gray-800 leading-6'>
                      <Image
                        src="/bigLogo.webp"
                        alt="logo"
                        width={50}
                        height={50}
                        className="w-[50px] h-[50px] sm:w-[50px] sm:h-[50px] md:w-[50px] md:h-[50px] lg:w-[50px] lg:h-[50px] xl:w-[40px] xl:h-[40px] xs:w-[40px] xs:h-[40px]"
                      />
                      <input
                        type="text"
                        value={editedSlogan}
                        onChange={(e) => setEditedSlogan(e.target.value)}
                        className={`border ${isEditing ? 'border-green-500' : 'border-none'} block xl:w-[470px] w-full  font-semibold italic text-gray-800 bg-transparent text-center ml-[-3px]`}
                        maxLength={40}
                        placeholder="Введите ваш девиз (не более 25 символов)"
                        disabled={!isEditing}
                      />
                    </p>
                    {userId === userData.slug && (
                      <>

                        {isEditing ? (
                          <button
                            className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm mt-5 ml-1"
                            onClick={handleSaveChanges}
                          >
                            Сохранить изменения
                          </button>
                        ) : (
                          <button
                            className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm mt-5 ml-1"
                            onClick={() => setIsEditing(!isEditing)}
                          >
                            Редактировать личный кабинет
                          </button>

                        )}

                      </>

                    )}
                    {loadStatus && (
                      <p className="text-gray-500 text-sm mt-2 flex items-center">
                        {loadStatus === 'Изображение загружается. Пожалуйста, подождите...' ? (
                          <FaSpinner className="animate-spin mr-2" />
                        ) : (
                          <FaCheck className="text-green-500 mr-2" />
                        )}
                        {loadStatus}
                      </p>
                    )}
                  </div>


                  <div className="flex items-start ml-5 photo-block">
                    <div className='relative mb-4'>
                      <div className="mt-2 mr-5 w-[180px] h-[180px] ">
                        {isLoading ? (
                          <div className="flex justify-center items-center w-full h-full">
                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          <Image
                            src={isEditing ? (filePreview || imageUrl || userData?.photo || '/default_avatar.jpg') : (userData?.photo || '/default_avatar.jpg')}
                            alt="User Avatar"
                            width={180}
                            height={180}
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>

                      {isEditing && (
                        <div className="flex flex-col">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={onChangeImage}
                            className="border border-green-500 font-semibold text-[9px] leading-6 p-1 mb-2 w-[11.2rem] "
                            disabled={!isEditing}
                          />


                        </div>
                      )}
                    </div>


                    <div className='flex ml-3 items-start'>
                      <div className="flex flex-col flex-grow profile-info">
                        <div className="flex justify-between items-center p-1 profile-info name">
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className={`border ${isEditing ? 'border-green-500 ml-[3px]' : 'border-none'} font-semibold text-gray-800 p-1 bg-white xs:w-[90%] xs:text-base sm:text-lg md:text-lg lg:text-lg `}
                            disabled={!isEditing}
                            maxLength={20}
                          />
                        </div>
                        <input
                          type="text"
                          value={editedExpert}
                          onChange={(e) => setEditedExpert(e.target.value)}
                          className={`border ${isEditing ? 'border-green-500' : 'border-none'} bg-white font-semibold text-gray-800 py-2 xs:w-[90%] ml-2 xs:text-lg sm:text-lg md:text-lg lg:text-lg profile-info exp`}
                          disabled={!isEditing}
                          maxLength={30}
                        />
                        <div className='my-1 ml-2 xs:w-[90%]'>
                          <RatingStars userSlug={userSlug} currentRating={rating} setRating={setRating} userId={userId} />
                        </div>
                        {userId !== userData.slug && (
                          <button
                            onClick={() => handleSendMessage(userData?.name, userData?.email)}
                            className="bg-blue-500 text-white text-sm px-4 py-2 ml-2 my-2 rounded-md text-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 max-w-xs w-auto "
                          >
                            <div>Записаться на консультацию</div>
                            <div>к {userData?.name}</div>
                          </button>
                        )}
                        {messageStatus && (
                          <p className={`text-center mt-2 text-sm ${messageStatus.includes('успешно') ? 'text-green-500' : 'text-red-500'}`}>
                            {messageStatus}
                          </p>
                        )}

                      </div>
                    </div>
                  </div>

                  <div className="w-full px-2">
                    <div className="card-info xs:w-[100%] sm:w-[100%] md:w-[100%] lg:w-[100%] px-4 pb-2">
                      <div className="flex items-center justify-between mt-5 xs:mt-5 sm:mt-0 md:mt-0 lg:mt-0 xl:mt-0">
                        <p className='font-bold text-gray-800 mt-1 ml-2 mr-2 info-block xs:text-base sm:text-base md:text-base lg:text-lg'>Информация о психологе:</p>
                        {isSmallScreen && (
                          <button
                            onClick={() => setShowAbout(!showAbout)}
                            className="text-gray-600 hover:text-blue-500 focus:outline-none px-3 py-1 mr-0 ml-auto text-lg ml-3 lg:text-sm md:text-sm xs:text-xs sm:text-sm mx-5 flex items-center"
                          >
                            {showAbout ? 'Скрыть' : 'Показать '}
                            {showAbout ? <AiFillCaretUp className="ml-1" /> : <AiFillCaretDown className="ml-1" />}
                          </button>
                        )}
                      </div>
                      {showAbout && (
                        <textarea
                          value={editedAbout}
                          onChange={(e) => setEditedAbout(e.target.value)}
                          className={`border ${isEditing ? 'border-green-500' : 'border-none'} text-gray-600 mt-2 p-2 rounded-md resize-none xs:w-[100%] sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%]`}
                          disabled={!isEditing}
                          rows={8}
                          maxLength={500}
                          placeholder="Введите информацию о себе... (не более 570 символов)"
                        />
                      )}
                    </div>

                    <div className="xs:w-[100%] sm:w-[100%] md:w-[100%] lg:w-[100%] mb-0 px-4 pb-2">
                      <div className="flex items-center justify-between mt-3 xs:mt-3 sm:mt-0 md:mt-0 lg:mt-0 xl:mt-0">
                        <p className='font-bold text-gray-800 mt-1 ml-2 mr-2 info-block xs:text-base sm:text-base md:text-base lg:text-lg'>Контактная информация:</p>
                        {isSmallScreen && (
                          <button
                            onClick={() => setShowContact(!showContact)}
                            className="text-gray-600 hover:text-blue-500 focus:outline-none px-3 py-1 mr-0 ml-auto text-lg ml-3 lg:text-sm md:text-sm xs:text-xs sm:text-sm mx-5 flex items-center"
                          >
                            {showContact ? 'Скрыть' : 'Показать'}
                            {showContact ? <AiFillCaretUp className="ml-1" /> : <AiFillCaretDown className="ml-1" />}
                          </button>
                        )}
                      </div>
                      {showContact && (
                        <textarea
                          value={editedContact}
                          onChange={(e) => setEditedContact(e.target.value)}
                          className={`border ${isEditing ? 'border-green-500' : 'border-none'} text-gray-600 leading-6 w-full mt-2 p-2 rounded-md resize-none s:w-[100%] xs:w-[100%] md:w-[100%]`}
                          disabled={!isEditing}
                          rows={3}
                          maxLength={100}
                        />
                      )}
                    </div>
                  </div>

                </>
              )
            }


            <hr className="mt-10 my-4 border-gray-400 xs:mt-0 sm:mt-0 md:mt-5 lg:mt-5" />
            <div className="w-full mt-5 px-3 xs:mt-0 sm:mt-0 md:mt-0">
              <div className="flex w-full items-center justify-between">
                <p className='text-lg font-bold ml-5 lg:text-lg md:text-lg xs:text-xs sm:text-sm mx-5'>Комментарии</p>
                <button
                  className="text-gray-600 hover:text-blue-500 focus:outline-none border border-gray-300 rounded-2xl px-3 py-1 mr-5 text-lg ml-2 lg:text-sm md:text-sm xs:text-xs sm:text-sm mx-5 ml-auto"
                  onClick={() => setIsCommenting(!isCommenting)}
                >
                  {isCommenting ? 'Скрыть комментарии' : 'Показать комментарии'}
                </button>
              </div>

              {isCommenting && (
                <>
                  <div className="flex w-full items-center py-3 xs:ml-1 sm:ml-1 md:ml-1 ">
                    <input
                      type="text"
                      className="lg:w-[90%] w-10/12 font-semibold text-gray-500 text-md leading-6 mr-2"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Текст комментария"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleComment();
                        }
                      }}
                    />
                    <button
                      className="text-white text-lg bg-gray-500 hover:bg-blue-500 mr-5 py-1 px-2 rounded-2xl font-semibold xs:text-xs xs:lowercase sm:text-xs md:text-sm lg:text-base"
                      onClick={() => {
                        handleComment();
                        setIsCommenting(true);
                      }}>Сохранить</button>
                  </div>

                  <ul className=" bg-gray-100 comment-lg comment-small">

                    {allUsers.length > 0 && comments && comments.map(comment => (
                      <li className="flex flex-col p-3 bg-white shadow rounded-lg mb-3 mt-2 " key={comment.id}>
                        <div className="flex items-center space-x-3 justify-between">
                          {editCommentId === comment.id ? (
                            <div className="flex items-center justify-between">
                              <input
                                type="text"
                                className="w-full font-semibold text-gray-500 text-md leading-6 mr-auto"
                                value={editedCommentText}
                                onChange={(e) => setEditedCommentText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditComment();
                                  }
                                }}
                              />
                              <button
                                className="text-white bg-gray-500 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 font-semibold rounded-2xl text-sm py-1 px-2 text-center mt-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 uppercase shadow-lg ml-3"
                                onClick={handleEditComment}>Сохранить</button>
                            </div>
                          ) : (
                            <div className="flex w-full justify-between">
                              <div className="flex items-center">
                                <img src={getCommentPhoto(comment.userId) || userData?.photo || '/default_avatar.jpg'} alt="User Avatar" className="w-10 h-10 rounded-full object-cover mr-3" />
                                <div className="flex flex-col flex-grow">
                                  <p className="text-xs font-semibold text-gray-800">{comment?.userId === userId ? 'Вы' : comment?.name}</p>
                                  <p className="text-md text-gray-600 mt-1">{comment.content}</p>
                                </div>
                              </div>
                              {editCommentId !== comment.id && comment.userId === userId && (
                                <>
                                  <div className="flex ml-auto">
                                    <FaPen
                                      className='cursor-pointer mt-1 mr-3'
                                      onClick={() => { setEditCommentId(comment.id); setEditedCommentText(comment.content); }}
                                    />
                                    <div className='cursor-pointer mt-1 mr-5' onClick={() => handleDeleteComment(comment.id)}>
                                      <MdClose />
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          <div className="w-full p-3 mx-auto mt-[-3px] lg:mt-[-3px]  bg-white rounded-2xl shadow-2xl border xs:py-3 my-5 m-0 md:py-0 md:py-3-lg lg:py-3-md xl:py-3-2xl questions-lg questions-small questions-laptop questions-laptop-small ">
            <div className="w-full p-1 ">
              <p className='font-semibold  text-gray-800 leading-6 mt-3 mx-3'>Вопросы, на которые ответил психолог:</p>
              {userData && userData.answeredQuestions && (
                <ul className='text-gray-600 leading-6 mt-2 mx-3'>
                  {userData.answeredQuestions.length > 0 ? (
                    userData.answeredQuestions.map((question: any, index: number) => (
                      <li
                        key={index}
                        onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) => handleClick(`${question.slug}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e: React.KeyboardEvent<HTMLLIElement>) => e.key === 'Enter' && handleClick(`${question.slug}`)}
                        className="my-3"
                      >
                        <hr /> {question.title}
                      </li>

                    ))
                  ) : (
                    <li>Пока нет ответов на вопросы.</li>
                  )}
                </ul>
              )}
            </div>
          </div>
          <br />
          {!userData && (
            <div className="flex justify-center">
              <Link href={HOME_ROUTE}>
                <button className="mt-4 px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600 xs:text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm">
                  Вернуться на главную
                </button>
              </Link>
            </div>
          )}
        </div >
      </div>
    </>
  );
};


export default PsyAccount;

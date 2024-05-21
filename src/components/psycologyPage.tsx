"use client";
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { updateUser } from '@/lib/firebase/firebaseFunctions';
import { Comments } from '@/interfaces/collections';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import PsychologistDashboard from './PsychologistVideoManager';
import { FaPen } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { useAppSelector } from '../redux/hooks';
import { useRouter } from 'next/navigation';
import RatingStars from './Rating';
import { uploadImageToStorage } from '@/lib/firebase/firebaseConfig';
import { sendTelegramMessage } from '../app/script/telegram';



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
  const [telegramUserID, setTelegramUserID] = useState<string>('');
  const userId = useAppSelector((state) => state.auth.user?.id);
  const userName = useAppSelector((state) => state.auth.user?.name);
  const userPhoto = useAppSelector((state) => state.auth.user?.photo);
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
        setTelegramUserID(fetchedUserData.telegramUserID || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    if (userSlug) {
      fetchUserData(userSlug);
    }

  }, [userSlug]);

  const handleSaveChanges = async () => {
    try {
      await updateUser(userSlug, {
        aboutUser: editedAbout,
        contactUser: editedContact,
        slogan: editedSlogan,
        expert: editedExpert,
        name: editedName,
        telegramUserID: telegramUserID,
      });

      setUserData({
        ...userData,
        aboutUser: editedAbout,
        contactUser: editedContact,
        slogan: editedSlogan,
        expert: editedExpert,
        name: editedName,
        telegramUserID: telegramUserID,
      });
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
      photo: userPhoto,
      userId,
    };
    const newCommentsArray = [...comments, newComment]

    setComments(newCommentsArray);
    setCommentText('');
    setIsCommenting(false);
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
      await updateUser(userSlug, { ratings: [newRating] });
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };


  const handleUploadImage = async () => {
    if (image) {
      const imageUrl = await uploadImageToStorage(image);
      if (imageUrl) {

        try {
          await updateUser(userSlug, { photo: imageUrl });
          setUserData((prevUserData: any) => ({
            ...prevUserData,
            photo: imageUrl
          }));
          setImageUrl(imageUrl);
          console.log('Изображение загружено:', imageUrl);
        } catch (error) {
          console.error('Ошибка при обновлении фотографии:', error);
        }
      }
    }
  };


  const handleSendMessage = async (psyName: any, telegramUserId: any, email: any) => {
    try {
      await sendTelegramMessage(userName, userEmail, psyName, telegramUserId);
      setMessageStatus('Уведомление успешно отправлено в Telegram психолога.');
    } catch (error) {
      setMessageStatus(`Психолог не может получать уведомления. Пожалуйста, пишите на почтовый адрес: ${email}`);
    }
  };



  return (

    <div className="container mx-auto px-4 py-4 max-w-7xl mt-[-40px]">
      <div className="flex flex-wrap -mx-1 lg:-mx-1 xs:mx-1 s:mx-2 md:mx-3">
        <div className="w-full lg:w-1/4 px-1 lg:mb-0 order-last lg:order-first">
          {userData && <PsychologistDashboard />}
        </div>
        <div className="container mx-auto mt-[-1px] sm:mx-2 md:mx-3 lg:mx-1 px-2 py-4 max-w-3xl bg-white shadow-xl rounded-2xl xs:container-min card-small" style={{ maxWidth: '600px' }}>
          {
            userData && (
              <>
                <div className="text-center mb-5 w-full">
                  <p className='flex items-center justify-start bg-amber-300 pl-6 py-1 rounded-2xl text-center text-gray-800 leading-6 '>
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
                      className={`border ${isEditing ? 'border-green-500' : 'border-none'} block w-full font-semibold italic text-gray-800 bg-transparent text-center ml-[-3px]`}
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

                </div>


                <div className="flex items-start ml-5 photo-block">
                  <div className="relative mb-4">
                    <Image
                      src={imageUrl || (userData?.photo ? userData.photo : '/default_avatar.jpg')}
                      alt="User Avatar"
                      width={180}
                      height={180}
                      className="user-photo-container mt-2 mr-5"
                    />
                    {isEditing && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImage(e.target.files?.[0] || null)}
                          className="border border-green-500 font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm leading-6 p-1 mb-2 w-full"
                          disabled={!isEditing}
                        />
                        <button
                          onClick={handleUploadImage}
                          className="bg-blue-500 text-white xs:text-xs sm:text-sm md:text-sm lg:text-sm px-4 py-2 rounded-full shadow hover:bg-blue-600 focus:outline-none"
                          disabled={!image}
                        >
                          Загрузить изображение
                        </button>

                      </>
                    )}
                  </div>


                  <div className="flex ml-3 items-start">
                    <div className="flex flex-col flex-grow profile-info">
                      <div className="flex justify-between items-center p-1 profile-info">
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className={`border ${isEditing ? 'border-green-500' : 'border-none'} font-semibold text-gray-800 p-1 bg-white xs:w-[90%] xs:text-lg sm:text-lg md:text-lg lg:text-lg `}
                          disabled={!isEditing}
                          maxLength={20}
                        />
                        <div className='mx-2 xs:w-[90%] profile-info name '>
                          <RatingStars userSlug={userSlug} currentRating={rating} setRating={setRating} userId={userId} />
                        </div>
                      </div>
                      <input
                        type="text"
                        value={editedExpert}
                        onChange={(e) => setEditedExpert(e.target.value)}
                        className={`border ${isEditing ? 'border-green-500' : 'border-none'} bg-white font-semibold text-gray-800 py-2 xs:w-[90%] ml-2 xs:text-lg sm:text-lg md:text-lg lg:text-lg profile-info m-l `}
                        disabled={!isEditing}
                        maxLength={30}
                      />
                      <button
                        onClick={() => handleSendMessage(userData?.name, userData?.telegramUserID, userData?.email)}
                        className="bg-blue-500 text-white text-sm px-4 py-2 ml-2 my-2 rounded-md text-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 max-w-xs w-auto "
                      >
                        <div>Записаться на консультацию</div>
                        <div>к {userData?.name}</div>
                      </button>

                      {messageStatus && (
                        <p className={`text-center mt-2 text-sm ${messageStatus.includes('успешно') ? 'text-green-500' : 'text-red-500'}`}>
                          {messageStatus}
                        </p>
                      )}

                    </div>
                  </div>
                </div>

                <div>
                  <div className="card-info lg:w-[90%] s:w-[100%] xs:w-[100%] md:w-[100%] mr-10 pb-2">
                    <div className="flex items-center justify-between">
                      <p className='font-bold text-gray-800 mt-1 ml-5 mr-5 info-block xs:text-sm sm:text-sm md:text-base lg:text-lg'>Информация о психологе:</p>
                      {isSmallScreen && (
                        <button
                          onClick={() => setShowAbout(!showAbout)}
                          className=" text-gray-600 hover:text-blue-500 focus:outline-none px-3 py-1 mr-0 ml-2 text-lg lg:text-sm md:text-sm xs:text-xs sm:text-sm flex items-center"
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
                        className={`border ${isEditing ? 'border-green-500' : 'border-none'} text-gray-600 w-full mt-2 ml-4 p-2 rounded-md resize-none s:w-[100%] xs:w-[100%] md:w-[100%]`}
                        disabled={!isEditing}
                        rows={8}
                        maxLength={500}
                        placeholder="Введите информацию о себе... (не более 570 символов)"
                      />
                    )}
                  </div>

                  <div className="lg:w-[90%] s:w-[100%] xs:w-[100%] md:w-[100%] mb-0 mr-10 pb-2">
                    <div className="flex items-center justify-between">
                      <p className='font-bold text-gray-800 mt-1 ml-5 mr-5 info-block xs:text-sm sm:text-sm md:text-base lg:text-lg'>Контактная информация:</p>
                      {isSmallScreen && (
                        <button
                          onClick={() => setShowContact(!showContact)}
                          className="text-gray-600 hover:text-blue-500 focus:outline-none px-3 py-1 mr-4 text-lg ml-3 lg:text-sm md:text-sm xs:text-xs sm:text-sm mx-5 flex items-center"
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
                        className={`border ${isEditing ? 'border-green-500' : 'border-none'} text-gray-600 leading-6 mt-2 p-2 ml-4 rounded-md resize-none s:w-[100%] xs:w-[100%] md:w-[100%]`}
                        disabled={!isEditing}
                        rows={3}
                        maxLength={100}
                      />
                    )}
                  </div>
                </div>
                {userId === userData.slug && (

                  <div className="flex flex-col items-start p-6 rounded-2xl text-gray-800 leading-6 bg-gray-100 space-y-4">
                    <p className="text-center">
                      UserId в телеграмме (Чтобы получить UserId перейдите по ссылке{' '}
                      <a
                        href="https://t.me/getmyid_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        getMyUserId
                      </a>
                      {' '}и отправьте сообщение /start)
                    </p>
                    <input
                      type="text"
                      value={telegramUserID}
                      onChange={(e) => setTelegramUserID(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Введите userId"
                      className={`appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!isEditing ? 'bg-gray-200' : 'bg-white'}`}
                    />
                    <p className="text-center">
                      Чтобы получать уведомление о клиенте в Telegram, начните переписку с ботом {' '}
                      <a
                        href="https://t.me/newPsy1bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        psyBot
                      </a>
                    </p>
                  </div>

                )}
              </>
            )
          }


          <hr className="mt-10 my-4 border-gray-400 xs:mt-0 sm:mt-0 md:mt-5 lg:mt-5" />
          <div className="mt-5 ml-5 xs:mt-0 sm:mt-0 md:mt-0">
            <div className="flex items-center justify-between">
              <p className='text-lg font-bold ml-2 lg:text-lg md:text-lg xs:text-xs sm:text-sm mx-5'>Комментарии</p>
              <button
                className="text-gray-600 hover:text-blue-500 focus:outline-none border border-gray-300 rounded-2xl px-3 py-1 mr-5 text-lg ml-2 lg:text-sm md:text-sm xs:text-xs sm:text-sm mx-5"
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
                    className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold lg:text-sm md:text-sm xs:text-xs sm:text-sm mx-5"
                    onClick={() => {
                      handleComment();
                      setIsCommenting(true);
                    }}>Сохранить</button>
                </div>

                <ul className=" bg-gray-100" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {comments.map(comment => (
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
                          <>
                            <div className="flex">
                              <img src={comment.photo || '/default_avatar.jpg'} alt="User Avatar" className="w-10 h-10 rounded-full object-cover mr-3" />
                              <div className="flex flex-col flex-grow">
                                <p className="text-xs font-semibold text-gray-800">{comment?.userId === userId ? 'Вы' : comment?.name}</p>
                                <p className="text-md text-gray-600 mt-1">{comment.content}</p>
                              </div>
                            </div>
                            {editCommentId !== comment.id && comment.userId === userId && (
                              <>
                                <div className="flex">
                                  <FaPen
                                    className='cursor-pointer mt-1 mr-3'
                                    onClick={() => { setEditCommentId(comment.id); setEditedCommentText(comment.content); }}
                                  />
                                  <div className='cursor-pointer mt-1 mr-5 ml-auto' onClick={() => handleDeleteComment(comment.id)}>
                                    <MdClose />
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <div className="p-3 mx-auto mt-[-3px] bg-white rounded-2xl shadow-2xl border xs:py-3 my-5 md:py-0 md:py-3-lg xl:py-3-2xl questions-lg questions-small">
          <div className="w-full p-1">
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

  );
};

export default PsyAccount;

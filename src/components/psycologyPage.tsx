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
import { useAppSelector } from '../redux/hooks';
import { useRouter } from 'next/navigation';
import RatingStars from './Rating';
import { uploadImageToStorage } from '@/lib/firebase/firebaseConfig';


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
  const userPhoto = useAppSelector((state) => state.auth.user?.photo);
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const params = useParams();
  const userSlug: any = params.slug;
  const router = useRouter();
  const [rating, setRating] = useState(0);




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

  const handleSaveChanges = async () => {
    try {
      await updateUser(userSlug, {
        aboutUser: editedAbout,
        contactUser: editedContact,
        slogan: editedSlogan,
        expert: editedExpert,
        name: editedName,
      });

      setUserData({
        ...userData,
        aboutUser: editedAbout,
        contactUser: editedContact,
        slogan: editedSlogan,
        expert: editedExpert,
        name: editedName,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

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
                      className={`border ${isEditing ? 'border-green-500' : 'border-none'} block w-full font-semibold text-gray-800 bg-transparent text-center mr-3`}
                      maxLength={25}
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
                

                <div className="flex ml-5 items-start">
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className={`border ${isEditing ? 'border-green-500' : 'border-none'} font-semibold text-gray-800 p-1 bg-white xs:w-[90%] w-full`}
                        disabled={!isEditing}
                      />
                      <div className='mx-2 xs:w-[90%]'>
                        <RatingStars userSlug={userSlug} currentRating={rating} setRating={setRating} />
                      </div>
                    </div>
                    <input
                      type="text"
                      value={editedExpert}
                      onChange={(e) => setEditedExpert(e.target.value)}
                      className={`border ${isEditing ? 'border-green-500' : 'border-none'} bg-white font-semibold text-gray-800 py-2 xs:w-[90%] w-full ml-1`}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                </div>

                <div className="card-info lg:w-[90%] s:w-[100%] xs:w-[100%] md:w-[100%] mr-10 " >
                  <p className='font-bold text-gray-800 mt-1 ml-5 mr-5'>Информация о психологе:</p>
                  <textarea
                    value={editedAbout}
                    onChange={(e) => setEditedAbout(e.target.value)}
                    className={`border ${isEditing ? 'border-green-500' : 'border-none'} text-gray-600 w-full mt-2 ml-4 p-2 rounded-md resize-none s:w-[100%] xs:w-[100%] md:w-[100%]`}
                    disabled={!isEditing}
                    rows={8}
                    maxLength={570}
                    placeholder="Введите информацию о cебе... (не более 570 символов)"
                  
                  />
                </div>
                <div className=" lg:w-[90%] s:w-[100%] xs:w-[100%] mb-0 md:w-[100%] mr-10">
                  <p className='font-bold text-gray-800 mt-3 ml-5'>Контактная информация:</p>
                  <textarea
                    value={editedContact}
                    onChange={(e) => setEditedContact(e.target.value)}
                    className={`border ${isEditing ? 'border-green-500' : 'border-none'} text-gray-600 leading-6 mt-2 ml-4 rounded-md resize-none s:w-[100%] xs:w-[100%] md:w-[100%]`}
                    disabled={!isEditing}
                    rows={3}
                    maxLength={118}
                  />
                </div>
              </>
            )
          }

          <hr className="mt-10 my-4 border-gray-400" />
          <div className="mt-5 ml-5" style={{ maxHeight: '800px', overflowY: 'auto' }}>
            <p className='text-lg font-bold ml-2'>Комментарии</p>
            {!isCommenting ? (
              <button
                className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sn my-5 mt-5 ml-1"
                onClick={() => setIsCommenting(true)}>Комментировать</button>
            ) : (
              <div className="flex w-full items-center py-3">
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
                  className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sn my-5 mt-5 ml-1"
                  onClick={handleComment}>Сохранить</button>
              </div>
            )}

            <ul style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {comments.map(comment => (
                <li className="flex flex-col p-3 bg-white shadow rounded-lg mb-3 mt-2" key={comment.id}>
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
          </div>
        </div>
        <div className="p-3 mx-auto mt-[-3px] bg-white rounded-2xl shadow-2xl border xs:py-3 my-5 md:py-0 md:py-3-lg xl:py-3-2xl " style={{ width: '300px', maxHeight: '800px', overflowY: 'auto' }}>
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

"use client";
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { updateUser } from '@/lib/firebase/firebaseFunctions';
import { Comments } from '@/interfaces/collections';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import VideoGallery from './VideoGallery';
import PsychologistDashboard from './PsychologistVideoManager';
import { FaPen } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useAppSelector } from '../redux/hooks';
import slugify from 'slugify';
import { useRouter } from 'next/navigation';


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
  const userId = useAppSelector((state) => state.auth.user?.id);
  const userName = useAppSelector((state) => state.auth.user?.name);
  const userPhoto = useAppSelector((state) => state.auth.user?.photo);
  const params = useParams();
  const userSlug: any = params.slug;
  const router = useRouter();
  const [questionSlug, setQuestionSlug] = useState<string>('');

  const handleClick = async (url: string) => {
    try {
      await router.push(url);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  useEffect(() => {
    async function fetchUserData(userId: any) {
      try {
        const fetchedUserData: any = await fetchDoc('users', userId);
        setUserData(fetchedUserData);
        setComments(fetchedUserData?.comments ?? [])
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    if (userSlug) {
      fetchUserData(userSlug);
    }

  }, [userSlug]);

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
    await updateUser(userId, {
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
    await updateUser(userId, {
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

  useEffect(() => {
    const questionsString = userData?.answeredQuestions.join(', ');

    if (userData?.answeredQuestions && userData.answeredQuestions.length > 0) {
      const slug = slugify(questionsString, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
      setQuestionSlug(slug);
    }

  }, [userData]);
  


  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl mt-[-40px]">
      <div className="flex flex-wrap -mx-1 lg:-mx-1">
        <div className="w-full lg:w-1/4 px-1 lg:mb-0">
          {userData && <PsychologistDashboard />}
        </div>
        <div className="container ml-5 px-2 py-4 max-w-3xl bg-white shadow-xl rounded-2xl " style={{ maxWidth: '600px' }}>
          {userData && (
            <div className="text-center mb-5">
              <p className='flex items-center justify-center font-semibold bg-amber-300 px-7 py-1 rounded-2xl text-center text-gray-800 leading-7'>
                <Image
                  src="/bigLogo.webp"
                  alt="logo"
                  width={50}
                  height={50}
                  className="mr-2" />
                {userData.slogan}
              </p>
            </div>
          )}
          {
            userData && (
              <>
                <div className="flex ml-5 items-start">
                  {userData.photo && (
                    <div className="user-photo-container mt-2 mr-5">
                      <Image src={userData.photo} alt="User Avatar" width={180} height={180} />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <p className='font-semibold text-gray-800 leading-6 p-1'>{userData.name}</p>
                    {userData.expert}
                  </div>
                </div>
                <div>
                  <p className='font-bold text-gray-800 leading-6 mt-3 ml-5'>About:</p>
                  <p className=' text-gray-600 leading-6 mt-2 ml-5'>{userData.aboutUser}</p>
                </div>
                <div>
                  <p className='font-bold text-gray-800 leading-6 mt-3 ml-5'>Contact:</p>
                  <p className=' text-gray-600 leading-6 mt-2 ml-5'>{userData.contactUser}</p>
                </div>
              </>
            )
          }

          <div className="mt-10 ml-5">
            <p className='text-lg font-bold'>Комментарии</p>
            {!isCommenting ? (
              <button
                className="my-5"
                onClick={() => setIsCommenting(true)}>Комментировать</button>
            ) : (
              <div className="flex items-center py-3">
                <input
                  type="text"
                  className="w-10/12 font-semibold text-gray-500 text-md leading-6 mr-2"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Текст комментария"
                />
                <button
                  className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl"
                  onClick={handleComment}>Сохранить</button>
              </div>
            )}

            <ul>
              {comments.map(comment => (
                <li className="flex flex-col p-3 bg-white shadow rounded-lg mb-3 mt-2" key={comment.id}>
                  <div className="flex items-center space-x-3 justify-between">
                    {editCommentId === comment.id ? (
                      <div>
                        <input
                          type="text"
                          value={editedCommentText}
                          onChange={(e) => setEditedCommentText(e.target.value)}
                        />
                        <button onClick={handleEditComment}>Сохранить</button>
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
                        {editCommentId !== comment.id && (
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
        <div className="p-3 ml-5 bg-white rounded-2xl shadow-2xl border mt-[-3px]" style={{ width: '300px', maxHeight: '800px', overflowY: 'auto' }}>
  <div className="w-full p-1">
    <p className='font-semibold  text-gray-800 leading-6 mt-3 ml-5'>Answered Question:</p>
    {userData && userData.answeredQuestions && (
      <ul className='text-gray-600 leading-6 mt-2 ml-5'>
        {userData.answeredQuestions.length > 0 ? (
          userData.answeredQuestions.map((question: any, index: number) => (
            <Link key={questionSlug} href={`/questions/${questionSlug}`}>
              <li
                key={index}
                onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) => handleClick(`/questions/${questionSlug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent<HTMLLIElement>) => e.key === 'Enter' && handleClick(`/questions/${questionSlug}`)}
                className="my-3"
              >
                {question}
              </li>
            </Link>
          ))
        ) : (
          <li>No answered questions yet.</li>
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

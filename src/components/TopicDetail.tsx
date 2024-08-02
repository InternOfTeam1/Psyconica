"use client";

import { useEffect, useState } from 'react';
import { fetchDataFromCollection, fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { Topic, Users, Video } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useParams, useRouter } from 'next/navigation';
import VideoGallery from './VideoGallery';
import { getUsersWithMatchingQuestions } from '@/lib/firebase/firebaseFunctions';
import Image from 'next/image';
import icon from '../../public/iconPsy.png';
import { Data } from '@/interfaces/collections';
import { openModal } from '@/redux/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useAppSelector } from '@/redux/hooks';

type Props = {
  videos: Video[]
  topicsData: Topic;
  usersWithMatchingQuestions: any;
}

const TopicDetail: React.FC<Props> = ({ videos }) => {
  const [topicData, setTopicData] = useState<Topic | null>(null);
  const [matchingUsers, setMatchingUsers] = useState<Users[]>([]);
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const topicSlug = params?.slug ? encodeURIComponent(params.slug) : null;
  const userId = useAppSelector((state) => state.auth.user?.id);

  const handleOpenModal = () => {
    dispatch(openModal());
  };

  useEffect(() => {
    if (topicSlug) {
      const fetchData = async () => {
        try {
          const data: any = await fetchDoc('topics', topicSlug);
          setTopicData(data);
          if (data && data.questions) {
            const users: any = await getUsersWithMatchingQuestions(data.questions);
            setMatchingUsers(users);
          }
        } catch (error) {
          console.error('Ошибка загрузки данных:', error);
        }
      };
      fetchData();
    }
  }, [topicSlug]);

  useEffect(() => {
    if (topicData?.title) {
      document.title = topicData.title;
    }
  }, [topicData]);

  const handleClick = async (item: any, type: string, event?: React.MouseEvent<HTMLDivElement>) => {
    let path: any;
    event?.preventDefault();
    switch (type) {
      case 'question': {
        const questionsData = await fetchDataFromCollection('questions') as Data[];
        const foundQuestion: any = questionsData
          .filter(question => question.title !== undefined)
          .find((question) => item.includes(question.title));

        path = `/questions/${foundQuestion?.slug}`;
        break;
      }
      case 'article': {
        path = `/articles/${item.slug}`;
        break;
      }
      case 'profile': {
        if (!userId) {
          handleOpenModal(); 
          console.error("User ID is undefined.");
          return;
        }
      
        try {
          const usersData = await fetchDataFromCollection('users') as Data[];
          const foundUser = usersData.find(user => user.userId === item);
      
          if (foundUser) {
            path = `/profile/${foundUser.slug}`;
          } else {
            console.error('User not found');
          }
        } catch (error) {
          console.error("An error occurred while fetching users data:", error);
        }
        break;
      }
      default:
        console.error('Unknown type:', type);
        return;
      }

    try {
      if (event?.button === 1) {
        event.preventDefault();
        window.open(path, '_blank', 'noopener noreferrer');
      } else {
        await router.push(path);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleClickTopic = async (url: string, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      await router.push(url);
    } catch (error) {
      console.error('Ошибка навигации:', error);
    }
  };

  return (
    <div className="container mx-auto px-5 py-4 max-w-[1200px] mt-[-20px] justify-center">
      <div className="grid grid-cols-1 md:grid-cols-12 md:mx-auto gap-4 xs:ml-0 sm:ml-0 md:ml-[-20px] md:px-5 lg:ml-[-30px] lg:px-5 xl:ml-[-40px]">
        <div className="order-last pt-3 xs:col-span-12 xs:order-last sm:col-span-12 sm:order-3 md:col-span-8 md:order-last lg:col-span-3 lg:order-first xl:col-span-3 xl:order-first bg-white rounded-lg shadow-lg" style={{ maxHeight: '785px' }}>
          <VideoGallery topicVideos={topicData?.video?.map(video => ({ url: video }))} videosData={videos} />
        </div>

        <div className="xs:col-span-12 xs:pb-5 sm:col-span-12 sm:order-1 sm:mx-auto sm:pb-5 md:col-span-8 md:order-1 lg:col-span-6 xl:col-span-6 bg-white p-6 rounded-lg shadow-lg overflow-hidden" style={{ maxHeight: '790px' }}>
          <h2 className="w-full font-semibold bg-amber-300 text-gray-600 text-base px-7 py-3 rounded-2xl leading-6 text-center">{topicData?.title}</h2>
          <h1 className="font-bold text-black-600 text-lg text-center mt-5 mb-5">Вопросы</h1>
          <div className="flex flex-col space-y-4" style={{ maxHeight: '290px', overflowY: 'auto', paddingBottom: '10px' }}>
            {topicData?.questions?.map((question: any, index: number) => (
              <div
                key={`question-${index}`}
                onClick={(e) => handleClick(question, 'question', e)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleClick(question, 'question')}
                onMouseDown={(e) => {
                  if (e.button === 1) {
                    e.preventDefault();
                    handleClick(question, 'question', e);
                  }
                }}
                className="bg-white mx-1 p-3 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
              >
                <h2 className="text-base font-semibold">{question}</h2>
              </div>
            ))}
          </div>

          <h1 className="font-bold text-black-600 text-lg text-center mt-5 mb-6">Статьи</h1>
          <div className="flex flex-col space-y-4" style={{ maxHeight: '290px', overflowY: 'auto', paddingBottom: '10px' }}>
            {topicData?.articles?.map((article: any, index: number) => (
              <Link key={article.slug || article.id} href={`/articles/${article.slug || article.id}`}>
                <div
                  key={`article-${index}`}
                  onClick={(e) => handleClickTopic(`/articles/${article.slug}`, e)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleClickTopic(`/articles/${article.slug}`, e)}
                  className="bg-white mx-1 p-3 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                >
                  <h2 className="text-base font-semibold">{article.title.split('. ')[0]}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="xs:col-span-12 sm:col-span-12 sm:order-2 md:col-span-4 md:order-2 lg:col-span-3 xl:col-span-3 bg-white p-4 rounded-lg shadow-lg" style={{ maxHeight: '785px' }}>
          <p className='font-bold text-center text-gray-800 leading-6 mt-3 mx-3 pb-4'>Блок психологов</p>
          <div className='w-full flex flex-col space-y-2'>
            {matchingUsers.map((user) => (
              <div key={user.userId} className="text-center">
                <div
                  onClick={(e) => handleClick(user.userId, 'profile', e)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleClick(user.userId, 'profile')}
                  className="flex items-center cursor-pointer"
                >
                  <Image src={user.photo || '/defaultPhoto.jpg'} alt="User Photo" width={50} height={50} className="w-10 h-10 rounded-full object-cover mr-3" />
                  <p className="font-semibold text-black flex items-center bg-gray-200 rounded-2xl p-1">{user.name}
                    <Image src={icon} alt="Psy Icon" width={20} height={20} /></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='text-center mt-5'>
        <Link href={HOME_ROUTE}>
          <button className="inline-block mt-4 mb-10 px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple hover:shadow-lg focus:outline-none hover:bg-blue-600">
            Вернуться на главную
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TopicDetail;

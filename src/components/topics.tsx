import React, { useEffect, useState } from 'react';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';
import { Data } from '@/interfaces/collections';
import { useRouter } from 'next/navigation';

const TopicsComponent: React.FC<{ position: 'left' | 'right' }> = ({ position }) => {
  const [topics, setTopics] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await fetchDataFromCollection('topics');
        setTopics(topicsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading topics: ', error);
        setError('Failed to load topics.');
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const half = Math.ceil(topics.length / 2);
  const topicToShow = position === 'left' ? topics.slice(0, half) : topics.slice(half);
  const backgroundImageUrl = '/8924461.png';

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleClick = async (url: string) => {
    try {
      await router.push(url);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="z-10 mx-auto grid grid-cols-1 gap-2 sm:p-6 md:pl-15 md:gap-2 lg:gap-2 xl:gap-6">
      {topicToShow.map((topic, index) => (
        <div
          key={index}
          className="z-10 w-full flex flex-col justify-center bg-no-repeat bg-center rounded-lg cursor-pointer"
          onClick={() => handleClick(`/topics/${topic.slug || topic.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick(`/topics/${topic.slug || topic.id}`)}

          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: '120%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >

          <div className="z-10 space-y-2 md:space-y-2  xs:pt-2 xs:pb-2 xs:pl-7 xs:pr-7 sm:pl-16 sm:pr-12 md:pl-[3.25rem] md:pr-[3.25rem] md:pt-1 md:pb-1 lg:pl-[2.25rem] lg:pr-[2.25rem] lg:pt-1 lg:pb-1">
            <h2 className="font-balsamiq-sans font-bold text-small-caps text-xs sm:text-sm md:text-base lg:text-base xl:text-lg text-gray-600">
              {topic.title}
            </h2>

          </div>
        </div>
      ))}

    </div>
  );
};

export default TopicsComponent;

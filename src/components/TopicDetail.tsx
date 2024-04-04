"use client";

import { useEffect, useState } from 'react';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { Topic } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useParams } from 'next/navigation';
import VideosFetcher from './VideosFetcher';

function fetchQuestionData(slug: {}) {
  return fetchDoc('topic', slug);
}

const TopicDetail = () => {
  const [topicData, setTopicData] = useState<Topic | null>(null);
  const params = useParams();
  const topicSlug: any = params.slug;

  useEffect(() => {
    const fetchData = async () => {
      if (topicSlug) {
        const data: any = await fetchQuestionData(topicSlug);
        setTopicData(data);
      }
    };

    fetchData();
  }, [topicSlug]);

  if (!topicData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl">
      <div className="flex flex-wrap -mx-1 lg:-mx-1">
        <div className="w-full lg:w-1/4 px-1 lg:mb-0">
          <VideosFetcher />
        </div>

        <div className="container mx-auto px-2 py-4 max-w-xl bg-white shadow-xl rounded-2xl">
          <h2 className="font-semibold bg-amber-300 text-gray-600 px-7 py-3 rounded-2xl leading-6 text-center">{topicData.title}</h2>

          <Link href={HOME_ROUTE}>
            <a className="inline-block mt-4 px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600">Вернуться на главную</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;

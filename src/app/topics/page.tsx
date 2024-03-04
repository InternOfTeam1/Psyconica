import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';
import { SubjectsList } from '@/components/SubjectsList';

export default function Topics() {
  const router = useRouter();

  const handleTopicClick = (title: string) => {
    router.push(`/topic/${encodeURIComponent(title)}`);
  };

  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await fetchDataFromCollection('topics');
        const titles = topicsData.map((topic) => topic.title);
        setTopics(titles);
      } catch (error) {
        console.error('Error loading topics: ', error);
      }
    };
    fetchTopics();
  }, []);

  return (
    <>
      <h1>Topics</h1>
      {topics.length > 0 ? (
        <SubjectsList
          position="left"
          topics={topics}
          onTopicClick={handleTopicClick}
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

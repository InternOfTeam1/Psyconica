"use client";

import { useEffect, useState } from 'react';
import MetaData from '@/components/MetaData';
import TopicPage from '@/components/TopicPage';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';

const Article: React.FC<{ params: { slug: string, articleId: string } }> = ({ params }) => {
  const { slug, articleId } = params;
  const [topicData, setTopicData] = useState<any>(null);
  const [title, setTitle] = useState('Loading...');
  const [description, setDescription] = useState('Loading article details...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await fetchDoc('topics', slug);
        if (data) {
          setTitle(data.title || 'Article Title');
          setDescription(data.SEODesc || 'Article Description');
          setTopicData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [slug]);

  if (!topicData) {
    return <p>Loading...</p>;
  }
  const article = topicData?.articles.find((a: any) => a.slug === articleId)

  return (
    <div>
      <MetaData title={title} description={description} />
      <TopicPage articleData={article} />
    </div>
  );
};

export default Article;
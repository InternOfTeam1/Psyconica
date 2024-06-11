"use client";

import { useEffect, useState } from 'react';
import MetaData from '@/components/MetaData';
// import ArticleDetail from '@/components/ArticleDetail';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';

const Article: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const { slug } = params;
  const [articleData, setArticleData] = useState<any>(null);
  const [title, setTitle] = useState('Loading...');
  const [description, setDescription] = useState('Loading article details...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await fetchDoc('articles', slug);
        if (data) {
          setTitle(data.title || 'Article Title');
          setDescription(data.SEODesc || 'Article Description');
          setArticleData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [slug]);

  if (!articleData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <MetaData title={title} description={description} />
      {/* <ArticleDetail articleData={articleData} /> */}
    </div>
  );
};

export default Article;

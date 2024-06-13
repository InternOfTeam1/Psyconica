"use client";

import { useEffect, useState } from 'react';
import MetaData from '@/components/MetaData';
import ArticleDetails from '@/components/ArticleDetail';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { Article } from '@/interfaces/collections';

const ArticlePage: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const { slug } = params;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDoc('articles', slug) as Article | null;
        if (data) {
          setArticle(data);
        } else {
          setError('Article not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching article details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {article ? <ArticleDetails article={article} /> : <p>Article not found</p>}
    </div>
  );
};

export default ArticlePage;

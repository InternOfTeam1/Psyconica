"use client";

import { useEffect, useState } from 'react';
import MetaData from '@/components/MetaData';
import QuestionDetail from '@/components/QuestionDetail';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { nanoid } from 'nanoid'


const Question: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const { slug } = params;
  const [rawData, setRawData] = useState<any>(null);
  const [title, setTitle] = useState('Loading...');
  const [description, setDescription] = useState('Loading question details...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await fetchDoc('questions', slug);
        if (data) {
          setTitle(data.title || 'Question Title');
          setDescription(data.description || 'Question Description');
          if (data.video) {
            const modifiedData = {
              ...data,
              video: data.video.map((url: any) => ({
                id: nanoid(),
                video: [url],
              })),
            };
            setRawData(modifiedData);
          } else {
            setRawData(data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [slug]);

  if (!rawData) {
    return <p>Loading...</p>; 
  }

  return (
    <div>
      <MetaData title={title} description={description} />
      <QuestionDetail rawData={rawData} />
    </div>
  );
};

export default Question;
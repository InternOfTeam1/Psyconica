"use client";

import { useEffect, useState } from 'react';
import QuestionDetail from '@/components/QuestionDetail';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { nanoid } from 'nanoid'



const Question: React.FC<{ params: { slug: string } }> = async ({ params }) => {
  const { slug } = params;
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await fetchDoc('questions', slug);
        if (data.video) {
          const modifiedData = {
            ...data,
            video: data.video.map((url: any) => ({
              id: nanoid(),
              video: [url],
            })),
          };
          setRawData(modifiedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [slug]);

  if (!rawData) {
    return null;
  }

  return (
    <div>
      <QuestionDetail rawData={rawData} />
    </div>
  );
};

export default Question;
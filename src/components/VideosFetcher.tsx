import React, { useEffect, useState } from 'react';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';
import { VideoBlock } from '@/components/VideoBlock';
import { Video } from '@/interfaces/collections'; 

const VideosFetcher: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const rawData = await fetchDataFromCollection('questions');
        console.log("Raw data from Firestore:", rawData);
        const transformedVideos = rawData.map(videoData => ({
          ...videoData,
          video: videoData.video || [],
        })) as Video[];
        setVideos(transformedVideos);
      } catch (error) {
        console.error('Error loading videos: ', error);
        setError('Failed to load videos.');
      } finally {
        setLoading(false);
      }
    };
  
    loadVideos();
  }, []);

  if (loading) {
    return <div>Loading videos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <VideoBlock videos={videos} />;
};

export default VideosFetcher;

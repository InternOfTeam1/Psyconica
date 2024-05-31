import QuestionsComponent from '@/components/forQuestionsPage';
import { Video } from "@/interfaces/collections";
import { fetchDataFromCollection } from "@/lib/firebase/firebaseGetDocs";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Questions Page',
    description: 'Page showing a list of questions', 
  };
}

function shuffleAndTrimVideos(videos: Video[], maxLength: number): Video[] {
  let shuffledVideos = videos.slice();

  for (let i = shuffledVideos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledVideos[i], shuffledVideos[j]] = [shuffledVideos[j], shuffledVideos[i]];
  }
  return shuffledVideos.filter(v => v.video).slice(0, maxLength);
}

const Questions: React.FC = async () => {

  const rawData = await fetchDataFromCollection('videos');

  if (!rawData) {
    return null
  }

  const videos = rawData as Video[];

  let data = shuffleAndTrimVideos(videos, 4)


  console.log(data);


  return (
    <div>
      <QuestionsComponent videos={data} />
    </div>
  );
};

export default Questions;

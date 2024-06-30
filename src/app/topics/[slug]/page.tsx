import { shuffleArray } from '@/app/questions/page';
import TopicDetail from '@/components/TopicDetail';
import { Data, Topic, Video } from '@/interfaces/collections';
import { getUsersWithMatchingQuestions } from '@/lib/firebase/firebaseFunctions';
import { fetchDataFromCollection, fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { notFound } from 'next/navigation';

const Question: React.FC = async ({ params }: any) => {
  const { slug } = params;
  const [rawData, topicsData, usersData] = await Promise.all([
    fetchDataFromCollection('videos'),
    fetchDoc('topics', slug) as Promise<Topic>,
    fetchDataFromCollection('users') as unknown as Data[]
  ]);

  if (!rawData || !topicsData || !usersData) {
    notFound();
  }

  let usersWithMatchingQuestions = null;

  if (topicsData && topicsData.questions) {
    usersWithMatchingQuestions = await getUsersWithMatchingQuestions(topicsData.questions);
  }

  let videosData: Video[] = [];

  usersData.forEach((user: any) => {
    if (user.video && user.video.length > 0) {
      user.video.forEach((videoUrl: string) => {
        videosData.push({ url: videoUrl, id: '', video: [], title: '', description: '', slug: '', content: '', date: '', likes: [], SEOTitle: '', SEODesc: '', canonical: '', userId: '' });
      });
    }
  });

  if (!videosData.length) {
    console.log("No videos found");
    notFound();
  }

  const shuffledVideos = shuffleArray(videosData);

  return (
    <div>
      <TopicDetail topicsData={topicsData} videos={shuffledVideos} usersWithMatchingQuestions={usersWithMatchingQuestions} />
    </div>
  );
};

export default Question;

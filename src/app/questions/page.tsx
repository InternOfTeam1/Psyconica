import QuestionsComponent from '@/components/forQuestionsPage';
import {Video} from "@/interfaces/collections";
import {fetchDataFromCollection, fetchDoc} from "@/lib/firebase/firebaseGetDocs";
import {nanoid} from "nanoid";

function shuffleAndTrimVideos(videos: Video[], maxLength: number): Video[] {
    let shuffledVideos = videos.slice();

    for (let i = shuffledVideos.length - 1; i > 0; i--) {
        // Выбираем случайный элемент из оставшихся
        const j = Math.floor(Math.random() * (i + 1));

        // Обмен элементов местами
        [shuffledVideos[i], shuffledVideos[j]] = [shuffledVideos[j], shuffledVideos[i]];
    }

    // Обрезаем массив до нужной длины
    return shuffledVideos.slice(0, maxLength);
}

 const Questions: React.FC = async () => {

     const videos = await fetchDataFromCollection('videos');

     if (!videos) {
         return null
     }

     let data= shuffleAndTrimVideos(videos, 4)


     console.log(data);


     return (
    <div>
      <QuestionsComponent videos={data} />
    </div>
  );
};

export default Questions;

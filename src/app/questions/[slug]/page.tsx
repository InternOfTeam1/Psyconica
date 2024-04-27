import QuestionDetail from '@/components/QuestionDetail';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { nanoid } from 'nanoid'



const Question: React.FC = async (props) => {
  const {params: { slug }} = props

  let rawData = await fetchDoc('questions', slug)

  if (!rawData) {
    return null
  }

 
  rawData = {
    ...rawData,
    video: rawData.video.map((url) => {
      return ({
        id: nanoid(),
        video: [url],
      })
    })
  }

  return (
    <div>
      <QuestionDetail rawData={rawData} />
    </div>
  );
};

export default Question;
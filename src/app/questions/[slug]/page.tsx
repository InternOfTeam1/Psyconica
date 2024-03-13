import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { Question, Answers } from '@/interfaces/collections';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';


const QuestionDetail = async ({ params,

}: {
  params: { slug: any };
}) => {

  const questionSlug = params.slug

  const questionData: any = await fetchDoc('questions', questionSlug);


  return (
    <div className="container mx-auto px-4">
      <h2 className="text-xl font-semibold">{questionData.title}</h2>

      {questionData.answers.map((answer: Answers, index: number) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <h2>Ответ: {answer.title}</h2>
        </div>
      ))}

      <Link href={HOME_ROUTE}>
        <button className="inline-block mt-4 px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600">
          Вернуться на главную
        </button>
      </Link>

    </div>


  );
};

export default QuestionDetail;
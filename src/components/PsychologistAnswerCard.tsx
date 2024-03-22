import React from 'react';
import { Answers } from '@/interfaces/collections';

interface PsychologistAnswerCardProps<T extends Answers> {
  answer: T;
}

const PsychologistAnswerCard = <T extends Answers>({ answer }: PsychologistAnswerCardProps<T>) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
    <h2 className="text-xl font-semibold">{answer.title}</h2>
      {answer.likes && (
        <p>
          Likes: {answer.likes.length}
        </p>
      )}
      {!('content' in answer) && <p>Content: Нет содержания</p>}
      {!('psychologistName' in answer) && <p>Ответил: Не указано</p>}
      {!('date' in answer) && <p>Дата: Не указана</p>}
    </div>
  );
};

export default PsychologistAnswerCard;
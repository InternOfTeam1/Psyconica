'use client'
import Link from "next/link";
import { HOME_ROUTE } from "@/constants/routes";
import PsychologistVideoManager from "@/components/PsychologistVideoManager";

const Account: React.FC = () => {
  return (
    
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
       <PsychologistVideoManager />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Личный Кабинет</h1>
        <Link href={HOME_ROUTE}>
          <button className="inline-block mt-4 px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600">
            Вернуться на главную
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Account;
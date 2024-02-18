import Link from "next/link";


const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 p-4 flex">
      <img src="/logo.png" alt="Psyconica Logo" className="h-10" />
      <nav className="flex space-x-4 mt-2">
        <Link href='/' className="text-white hover:text-gray-300">Главная страница</Link>
        <Link href='/articles' className="text-white hover:text-gray-300">Статьи</Link>
        <Link href='/questions' className="text-white hover:text-gray-300">Вопросы</Link>
        <Link href='/posts' className="text-white hover:text-gray-300">Записи</Link>
        <Link href='/account' className="text-white hover:text-gray-300">Личный кабинет</Link>
      </nav>

      <div className=" ml-auto">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">Sign in</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Sign up</button>
      </div>

    </header>
  );
};

export default Header;
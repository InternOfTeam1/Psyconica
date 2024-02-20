
import Link from "next/link";
import Social from "@/app/social/page";


const Header: React.FC = () => {
  return (
    <header className="fixed top-0 z-[40] w-full h-[100px] flex bg-transparent justify-between items-center px-10 md:px-20 p-4">
      <nav className="flex space-x-4 mt-2 gap-10">
        <Link href="/questions" className="text-gray-400 hover:text-neutral-600 uppercase font-semibold">Вопросы</Link>
        <Link href="/articles" className="text-gray-400 hover:text-neutral-600 uppercase font-semibold">Статьи</Link>
      </nav>

      <div className="ml-auto">
        <Link href="/login" className="text-gray-400 hover:text-neutral-600 font-semibold border-solid border-2 border-gray-400 rounded-[20px] px-5 py-2">Log in</Link>
        <Social />
      </div>

    </header>
  );
};

export default Header;
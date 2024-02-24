"use client"
import Link from "next/link";
import Social from "@/components/Social";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/firebase/firebaseConfig";


const Header: React.FC = () => {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        console.log(user);
        router.push('/account');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  return (
    <header className="fixed top-0 z-[40] w-full h-[100px] flex bg-transparent justify-between items-center px-10 md:px-20 p-4">
      <nav className="flex space-x-4 mt-2 gap-10">
        <Link href="/questions" className="text-gray-400 hover:text-neutral-600 uppercase font-semibold">Вопросы</Link>
        <Link href="/articles" className="text-gray-400 hover:text-neutral-600 uppercase font-semibold">Статьи</Link>
      </nav>

      <div className="ml-auto">
        <button onClick={handleLogin} className="text-gray-400 hover:text-neutral-600 font-semibold border-solid border-2 border-gray-400 rounded-[20px] px-5 py-2">Log in</button>
        <Social />
      </div>

    </header>
  );
};

export default Header;
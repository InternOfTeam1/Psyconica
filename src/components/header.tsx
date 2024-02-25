"use client"
import { useState, useEffect } from 'react';
import Link from "next/link";
import Social from "@/components/Social";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signOutGoogle } from "@/lib/firebase/firebaseConfig";
import { HOME_ROUTE, PROFILE_ROUTE } from "@/constants/routes";


const Header: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
        router.push(PROFILE_ROUTE);
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const handleLogout = async () => {
    await signOutGoogle();
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    router.push(HOME_ROUTE);
  };

  return (
    <header className="fixed top-0 z-[40] w-full h-[100px] flex bg-transparent justify-between items-center px-10 md:px-20 p-4">
      <nav className="flex space-x-4 mt-2 gap-10">
        <Link href="/questions" className="text-gray-400 hover:text-neutral-600 uppercase font-semibold">Вопросы</Link>
        <Link href="/articles" className="text-gray-400 hover:text-neutral-600 uppercase font-semibold">Статьи</Link>
      </nav>

      <div className="ml-auto">
        <ul className="flex items-center gap-2 mb-4">
          {!isAuthenticated ? (
            <li onClick={handleLogin} className="cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold border-solid border-2 border-gray-400 rounded-[20px] px-5 py-2">Log in</li>
          ) : (
            <>
              <Link href={PROFILE_ROUTE}>
                <li className="cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold border-solid border-2 border-gray-400 rounded-[20px] px-5 py-2">
                  Личный кабинет
                </li>
              </Link>
              <li onClick={handleLogout} className="cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold border-solid border-2 border-gray-400 rounded-[20px] px-5 py-2">
                Log out
              </li>
            </>
          )}

        </ul>
        <Social />
      </div>
    </header>
  );
};

export default Header;
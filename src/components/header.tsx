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
  const [UserPhoto, setUserPhoto] = useState('');

  useEffect(() => {
    const handleAuthChange = () => {
      const user = localStorage.getItem('user');
      const userProfileString = localStorage.getItem('userPhoto');
      setIsAuthenticated(!!user);
      console.log(userProfileString)
      if (userProfileString) {
        setUserPhoto(JSON.parse(userProfileString));
      }
    };

    handleAuthChange();

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);


  const emitAuthChangeEvent = () => {
    window.dispatchEvent(new CustomEvent('authChange'));
  };


  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
        emitAuthChangeEvent();
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
    emitAuthChangeEvent();
    router.push(HOME_ROUTE);
  };

  return (
    <header className="flex flex-wrap mx-auto max-w-[1200px] bg-transparent justify-between items-center align-middle xs:mb-[80px] mt-5 mb-[100px]">
      <h2 className="flex justify-center xs:order-first xs:w-full xs:text-lg xs:whitespace-nowrap sm:order-first sm:w-full sm:text-xl md:order-first md:w-full md:text-2xl lg:order-2 lg:w-auto lg:text-2xl xl:order-2 xl:text-3xl font-balsamiq-sans font-bold text-pink-600">Психология должна быть простой!</h2>

      <nav className="flex gap-2 xs:order-2 xs:ml-30 sm:order-2 sm:ml-30 md:order-2 md:ml-10 lg:order-1 xl:order-1">
        <Link href="/questions" className='text-gray-600 hover:text-neutral-600 hover:bg-neutral-600 hover:rounded-full hover:text-white uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm px-2'>Вопросы</Link>
        <Link href="/articles" className='text-gray-600 hover:text-neutral-600 hover:bg-neutral-600 hover:rounded-full hover:text-white uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm px-2'>Статьи</Link>
      </nav>

      <div className="xs:order-2 xs:mr-10 sm:order-2 sm:mr-20 md:order-2 md:mr-30 lg:order-3 xl:order-3 xl:mr-20 mr-5">
        <ul className="flex items-center gap-2 mb-4 align-middle">
          {!isAuthenticated ? (
            <li onClick={handleLogin} className="flex cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 border-solid border-2 border-gray-400 whitespace-nowrap rounded-[20px] mt-5 px-5">Log in</li>
          ) : (
            <>
              {isAuthenticated && (
                <img
                  src={UserPhoto}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mt-3"
                />
              )}
              <Link href={PROFILE_ROUTE}>
                <li className="cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm lg:text-base border-solid border-2 border-gray-400 rounded-[20px] mt-3 px-3">
                  Личный кабинет
                </li>
              </Link>
              <li onClick={handleLogout} className="cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm border-solid border-2 border-gray-400 rounded-[20px] mt-3 px-3">
                Log out
              </li>

            </>
          )}

        </ul>
      </div>
      <div className="flex bg-transparent justify-between items-center xs:order-last xs:w-full xs:mr-10 xs:justify-center xs:align-center sm:order-last sm:mr-20 sm:w-full md:order-last md:w-full md:mr-20 lg:order-last lg:w-ful lg:mr-20 xl:order-last xl:w-full mt-5">
        <Social />
      </div>
    </header>
  );
};

export default Header;
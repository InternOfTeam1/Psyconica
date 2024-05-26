"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import Social from "@/components/Social";
import Image from 'next/image';
import { HOME_ROUTE } from "@/constants/routes";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { login, logout, setUserState } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import PsychologistModal from './PsychologistCheckbox';
import { openModal, closeModal } from '@/redux/slices/modalSlice';
import { getVideosById, getUserData } from '@/lib/firebase/firebaseFunctions';
import { useAppSelector } from '../redux/hooks';
import { PiListBold } from 'react-icons/pi';

const Header: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const isModalOpen = useSelector((state: any) => state.modal.isModalOpen);
  const [isModalOpenPsy, setIsModalOpenPsy] = useState(false);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const userId = user?.id;
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  const handleNav = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 0) {
        setMenuOpen(false);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpenModal = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const userData = JSON.parse(userCookie as string);
      dispatch(setUserState(userData));
    }
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      getUserData(userId).then((userData) => {
        setUserPhoto(userData.photo || '/defaultPhoto.jpg');
      });
    }
  }, [userId]);

  const handleClick = async (userId: string | undefined) => {
    if (!userId) {
      handleOpenModal();
      console.error("User ID is undefined.");
      return;
    }

    try {
      await router.push(`/profile/${userId}`);
    } catch (error) {
      console.error('Ошибка навигации:', error);
    }
  };

  const handleLogin = async (provider: 'google' | 'facebook') => {
    try {
      await dispatch(login(provider));
      setIsModalOpenPsy(true);
    } catch (error) {
      console.error(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleLogout = async () => {
    dispatch(logout());
    Cookies.remove('user');
  };

  const checkUserLoginStatus = async () => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      dispatch(setUserState({ isAuthenticated: true, user: userData }));
    } else {
      dispatch(setUserState({ isAuthenticated: false, user: null }));
    }
  };

  useEffect(() => {
    checkUserLoginStatus();
  }, []);

  return (
    <>
      <header className="flex flex-wrap mx-auto max-w-[1200px] bg-transparent justify-between items-center xs:mb-[50px] mt-5 mb-[100px] header">
        {!menuOpen && (
          <div onClick={handleNav} className='sm:hidden cursor-pointer pl-5 pt-5 absolute top-0 left-0 text-gray-500 hover:text-white'>
            <PiListBold size={25} />
          </div>
        )}
        <nav className="gap-2 hidden sm:flex">
          <Link href="/questions" className="cursor-pointer text-gray-500 hover:bg-neutral-500 hover:rounded-full hover:text-white font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 mt-5 py-1 px-5 hidden sm:flex">Вопросы</Link>
          <Link href="/articles" className="cursor-pointer text-gray-500 hover:bg-neutral-500 hover:rounded-full hover:text-white font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 mt-5 py-1 px-5 hidden sm:flex">Статьи</Link>
        </nav>
        <div className="flex items-center justify-center">
          <Link href={HOME_ROUTE} className="flex items-center mt-5 lg:order-3 md:order-3 text-center xs:max-w-[80%] lg:max-w-[100%]">
            <Image
              src="/siteName.webp"
              alt="website name"
              width={400}
              height={100}
              className="max-w-full h-full object-cover"
              priority={true}
            />
          </Link>
        </div>
        <div className="xs:order-2 sm:order-2 sm:mr-10 md:order-2 md:mr-30 lg:order-3 xl:order-3 xl:mr-20 mr-5 ">
          <div className='xs:ml-4'>
            <Social />
          </div>
          <ul className="items-center gap-2 mb-4 align-middle list hidden sm:flex">
            {!isAuthenticated ? (
              <li onClick={handleOpenModal} className="flex cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 border-solid border-2 border-gray-400 whitespace-nowrap rounded-[20px] mt-5 mb-5 py-1 px-5">Вход через социальные сети</li>
            ) : (
              <>
                <Image src={userPhoto || '/defaultPhoto.jpg'} alt="User Photo" width={50} height={50} className="w-12 h-12 rounded-full cursor-pointer" />
                <li onClick={() => handleClick(userId)} className="flex cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 whitespace-nowrap border-solid border-2 border-gray-400 rounded-[20px] mt-5 mb-5 py-1 px-5">
                  Личный кабинет
                </li>
                <li onClick={handleLogout} className="flex cursor-pointer text-gray-400 hover:text-neutral-600 fonnpm run buildt-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 whitespace-nowrap border-solid border-2 border-gray-400 rounded-[20px] mt-5 mb-5 py-1 px-5">
                  Выйти
                </li>
              </>
            )}
          </ul>
          <div className='lg:hidden flex flex-col lg:order-3 xl:order-3 '>
            <ul className={`${menuOpen ? 'flex flex-col items-center' : 'hidden'} bg-gray-200 py-2 rounded-lg`}>
              <Link href="/">
                <li onClick={() => setMenuOpen(false)}
                  className='py-1.5 cursor-pointer text-black font-bold hover:text-white'>
                  Главная
                </li>
              </Link>
              <Link href="/questions">
                <li onClick={() => setMenuOpen(false)}
                  className='py-1.5  cursor-pointer text-black font-bold hover:text-white '>
                  Вопросы
                </li>
              </Link>
              <Link href="/articles">
                <li onClick={() => setMenuOpen(false)}
                  className='py-1.5 cursor-pointer text-black font-bold hover:text-white'>
                  Статьи
                </li>
              </Link>
              {!isAuthenticated ? (
                <li onClick={() => { handleOpenModal(); setMenuOpen(false); }} className="py-1.5 cursor-pointer text-black font-bold hover:text-white">Вход через социальные сети</li>
              ) : (
                <>
                  <li onClick={() => { setMenuOpen(false); handleClick(userId); }} className="py-1.5  cursor-pointer text-black font-bold hover:text-white">
                    Личный кабинет
                  </li>
                  <li onClick={() => { handleLogout(); setMenuOpen(false); }} className="py-1.5 cursor-pointer text-black font-bold hover:text-white">
                    Выйти
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </header>
      {isModalOpenPsy && userId && (
        <PsychologistModal
          isOpen={isModalOpenPsy}
          onClose={() => setIsModalOpenPsy(false)}
        />
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Вход</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Выберите способ входа:</p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => handleLogin('google')}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                      >
                        Вход через Google
                      </button>
                      <button
                        onClick={() => handleLogin('facebook')}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                      >
                        Вход через Twitter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

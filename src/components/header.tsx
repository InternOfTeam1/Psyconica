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
import { getUserData } from '@/lib/firebase/firebaseFunctions';
import { useAppSelector } from '../redux/hooks';
import { PiListBold, PiXBold } from 'react-icons/pi';
import { useRef } from 'react';


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
  const [userID, setUserID] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isToggle = useSelector((state: RootState) => state.toggle.isToggle);


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

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
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
        setUserID(userData.userId)
        setIsLoading(false);
      });
    }
  }, [userId, isToggle]);

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
      setIsModalOpenPsy(false);

    } else {
      dispatch(setUserState({ isAuthenticated: false, user: null }));
    }
  };

  useEffect(() => {

    if (!userID) {
      setIsModalOpenPsy(true); // Show the modal if userID does not exist
    } else {
      setIsModalOpenPsy(false); // Hide the modal if userID exists
    }

    checkUserLoginStatus();
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

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
                {isLoading ? (
                  <div>
                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <Image src={userPhoto || '/defaultPhoto.jpg'} alt="User Photo" width={50} height={50} className="w-12 h-12 rounded-full cursor-pointer" />
                )}
                <li onClick={() => handleClick(userId)} className="flex cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 whitespace-nowrap border-solid border-2 border-gray-400 rounded-[20px] mt-5 mb-5 py-1 px-5">
                  Личный кабинет
                </li>
                <li onClick={handleLogout} className="flex cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 whitespace-nowrap border-solid border-2 border-gray-400 rounded-[20px] mt-5 mb-5 py-1 px-5">
                  Выйти
                </li>
              </>
            )}
          </ul>
        </div>

        <div
          ref={menuRef}
          className={
            menuOpen
              ? "fixed top-0 left-0 w-[75%] sm:hidden p-7 ease-in duration-500 max-h-screen overflow-hidden bg-gradient-to-r from-purple-300 to-transparent z-50"
              : "fixed left-[-100%] top-0 p-10 ease-in duration-500 bg-gradient-to-r from-purple-300 to-transparent z-0"
          }>
          <div className='flex w-full items-center justify-start'>
            <div onClick={handleNav} className='cursor-pointer text-black hover:text-white'>
              <PiXBold size={25} />
            </div>
          </div>
          <div className='flex-col py-1.5'>
            <ul>
              <Link href={HOME_ROUTE} className='py-1.5 cursor-pointer text-black font-bold  hover:text-white'>
                <li onClick={() => setMenuOpen(false)}
                  className='py-1.5 cursor-pointer text-black font-bold  hover:text-white'>
                  Главная
                </li>
              </Link>
              <Link href="/questions">
                <li onClick={() => setMenuOpen(false)}
                  className='py-1.5 cursor-pointer text-black font-bold  hover:text-white'>
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
                <li onClick={() => { handleOpenModal(); setMenuOpen(false); }} className="py-1.5 cursor-pointer text-black font-bold  hover:text-white">Вход через социальные сети</li>
              ) : (
                <>

                  <li onClick={() => { setMenuOpen(false); handleClick(userId); }} className="py-1.5 cursor-pointer text-black font-bold  hover:text-white" >
                    Личный кабинет
                  </li>

                  <li onClick={() => { handleLogout(); setMenuOpen(false); }} className="py-1.5 cursor-pointer text-black font-bold  hover:text-white">
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

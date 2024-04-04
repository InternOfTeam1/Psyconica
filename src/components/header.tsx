"use client"
import { useState, useEffect } from 'react';
import Link from "next/link";
import Social from "@/components/Social";
import Image from 'next/image';
import LogoWebP from '/siteName.webp';
import { HOME_ROUTE, PROFILE_ROUTE } from "@/constants/routes";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { login, logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { setUserState } from "@/redux/slices/authSlice";
import Cookies from 'js-cookie';
import PsychologistModal from './PsychologistCheckbox';
import { openModal, closeModal } from '@/redux/slices/modalSlice';


const Header: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userPhoto = useSelector((state: RootState) => state.auth.user?.photo || '');
  const user: any = useSelector((state: RootState) => state.auth.user || '');
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const isModalOpen = useSelector((state: any) => state.modal.isModalOpen);
  const [isModalOpenPsy, setIsModalOpenPsy] = useState(false);
  const router = useRouter();

  const handleOpenModal = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const userData = { name: user.name, photo: user.photo, email: user.email };
      Cookies.set('user', JSON.stringify(userData), { expires: 7 });
      router.push(PROFILE_ROUTE);
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (provider: 'google' | 'facebook') => {
    try {
      await dispatch(login(provider));
      setIsModalOpenPsy(true)
    } catch (error) {
      console.error(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleLogout = async () => {
    dispatch(logout());
    Cookies.remove('user');
    router.push(HOME_ROUTE)

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
      <header className="flex flex-wrap mx-auto max-w-[1200px] bg-transparent justify-between items-center align-middle xs:mb-[50px] mt-5 mb-[100px]">
        <div className="flex items-center justify-center w-full">
          <Link href={HOME_ROUTE}>
            <Image
              src="/siteName.webp"
              alt="website name"
              width={200}
              height={100}
              className="max-w-full h-full"
            />
          </Link>
        </div>
        <nav className="flex gap-2 xs:order-2 xs:ml-20 sm:order-2 sm:ml-30 md:order-2 md:ml-10 lg:order-1 xl:order-1">
          <Link href="/questions" className='text-gray-600 hover:text-neutral-600 hover:bg-neutral-600 hover:rounded-full hover:text-white uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm px-2'>Вопросы</Link>
          <Link href="/articles" className='text-gray-600 hover:text-neutral-600 hover:bg-neutral-600 hover:rounded-full hover:text-white uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm px-2'>Статьи</Link>
        </nav>
        <div className="xs:order-2 sm:order-2 sm:mr-20 md:order-2 md:mr-30 lg:order-3 xl:order-3 xl:mr-20 mr-5">
          <ul className="flex items-center gap-2 mb-4 align-middle">
            {!isAuthenticated ? (
              <li onClick={handleOpenModal} className="flex cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 border-solid border-2 border-gray-400 whitespace-nowrap rounded-[20px] mt-5 px-5">Log in with social network</li>
            ) : (
              <>
                <img
                  src={userPhoto}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mt-3"
                />

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
      {isModalOpenPsy && (
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Login</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Choose your login method:</p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => handleLogin('google')}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                      >
                        Log in with Google
                      </button>
                      <button
                        onClick={() => handleLogin('facebook')}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                      >
                        Log in with Twitter
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
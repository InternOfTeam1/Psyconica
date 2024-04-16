"use client"
import { useState, useEffect } from 'react';
import Link from "next/link";
import Social from "@/components/Social";
import Image from 'next/image';
// import LogoWebP from '/siteName.webp';
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
    // router.push(HOME_ROUTE)
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
    <header className="flex flex-wrap mx-auto max-w-[1200px] bg-transparent justify-between items-center align-middle xs:mb-[50px] mt-5 mb-[100px] header">
     <nav className="flex gap-2 nav">
      <Link href="/questions" className="flex cursor-pointer text-gray-500 hover:text-neutral-600  hover:bg-neutral-500  hover:rounded-full hover:text-white font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 mt-5 py-1 px-5 nav-link">Вопросы</Link>
      <Link href="/articles" className="flex cursor-pointer text-gray-500 hover:text-neutral-600  hover:bg-neutral-500  hover:rounded-full hover:text-white font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 mt-5 py-1 px-5 nav-link">Статьи</Link>
    </nav>
    <div className="flex items-center gap-2 ">
      <Link href={HOME_ROUTE} className="flex items-center mt-5 logo">
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
    <div className="xs:order-2 sm:order-2 sm:mr-20 md:order-2 md:mr-30 lg:order-3 xl:order-3 xl:mr-20 mr-5 social ">
        <Social />
          <ul className="flex items-center gap-2 mb-4 align-middle list">
            {!isAuthenticated ? (
              <li onClick={handleOpenModal} className="list-item flex cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 border-solid border-2 border-gray-400 whitespace-nowrap rounded-[20px] mt-5 mb-5 py-1 px-5">Log in with social network</li>
            ) : (
              <>

                <Image src={userPhoto} alt="User Profile" width={30} height={30} className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mt-3" />

                <Link href={PROFILE_ROUTE}>
                <li className=" list-item cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-base border-solid border-2 border-gray-400 whitespace-nowrap rounded-[20px] mt-5 mb-5 px-5 py-1 hover:bg-gray-200">
                    Личный кабинет
                  </li>
                </Link>
                <li onClick={handleLogout} className=" list-item cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-base border-solid border-2 border-gray-400 whitespace-nowrap rounded-[20px] mt-5 mb-5 px-5 py-1 hover:bg-gray-200">
                  Log out
                </li>
              </>
            )}
          </ul>
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
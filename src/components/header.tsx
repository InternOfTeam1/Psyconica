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
import { PiXBold, PiListBold } from "react-icons/pi";
import { getVideosById } from '@/lib/firebase/firebaseFunctions';


const Header: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userPhoto = useSelector((state: RootState) => state.auth.user?.photo || '');
  const user: any = useSelector((state: RootState) => state.auth.user || '');
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const isModalOpen = useSelector((state: any) => state.modal.isModalOpen);
  const [isModalOpenPsy, setIsModalOpenPsy] = useState(false);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleNav = () =>{
    setMenuOpen(!menuOpen)
  } 

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

//  useEffect(() => {
//     if (isAuthenticated && user) {
//       const userData = { name: user.name, photo: user.photo, email: user.email };
//       Cookies.set('user', JSON.stringify(userData), { expires: 7 });
//     }
//   }, [isAuthenticated, user, router]);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if(userCookie){
      dispatch(setUserState(JSON.parse(userCookie as string)));
      console.log(JSON.parse(userCookie as string))
    }
  },[dispatch])

  useEffect(() => {
    getVideosById(user.id);
  },[])

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
      <header className="flex flex-wrap mx-auto max-w-[1200px] bg-transparent justify-between items-center xs:mb-[50px] mt-5 mb-[100px] header">
        {!menuOpen && (
          <div onClick={handleNav} className='sm:hidden cursor-pointer pl-5 pt-5 absolute top-0 left-0 text-gray-500  hover:text-white'>
            <PiListBold size={25} />
          </div>
      )}
     <nav className="gap-2 hidden sm:flex">
      <Link href="/questions" className=" cursor-pointer text-gray-500  hover:bg-neutral-500  hover:rounded-full hover:text-white font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 mt-5 py-1 px-5 hidden sm:flex">Вопросы</Link>
      <Link href="/articles" className="cursor-pointer text-gray-500  hover:bg-neutral-500  hover:rounded-full hover:text-white font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 mt-5 py-1 px-5 hidden sm:flex">Статьи</Link>
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
        <Social />
          <ul className="items-center gap-2 mb-4 align-middle list hidden sm:flex">
            {!isAuthenticated ? (
              <li onClick={handleOpenModal} className="flex cursor-pointer text-gray-400 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm md:text-sm lg:order-3 lg:text-base xl:order-3 border-solid border-2 border-gray-400 whitespace-nowrap rounded-[20px] mt-5 mb-5 py-1 px-5">Log in with social network</li>
            ) : (
              <>
                <Image src={userPhoto} alt="User Profile" width={30} height={30} className="w-8 h-8 rounded-full border-2 border-gray-400 shadow-sm xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mt-5 mb-5 " />

                <Link href={PROFILE_ROUTE}>
                <li className=" list-item cursor-pointer text-gray-500 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-base border-solid border-2 border-gray-400 whitespace-nowrap rounded-[20px] mt-5 mb-5 px-5 py-1 hover:bg-gray-200">
                    Личный кабинет
                  </li>
                </Link>
                <li onClick={handleLogout} className=" list-item cursor-pointer text-gray-500 hover:text-neutral-600 font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-base border-solid border-2 border-gray-400 whitespace-nowrap rounded-[20px] mt-5 mb-5 px-5 py-1 hover:bg-gray-200">
                  Log out
                </li>
              </>
            )}
          </ul>
        </div>
        <div className={
          menuOpen 
          ? "fixed top-0 left-0 w-[75%] sm:hidden p-7 ease-in duration-500 max-h-screen overflow-hidden bg-gradient-to-r from-purple-300 to-transparent z-50"
          : "fixed left-[-100%] top-0 p-10 ease-in duration-500 bg-gradient-to-r from-purple-300 to-transparent z-0"
        }> 
        <div className='flex w-full items-center justify-start'>
          <div onClick={handleNav} className='cursor-pointer text-black hover:text-white'>
            <PiXBold size={25} />
          </div>
        </div>
        <div className='flex-col py-4'>
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
              <li onClick={() => { handleOpenModal(); setMenuOpen(false); }} className="py-1.5 cursor-pointer text-black font-bold  hover:text-white">Log in with social network</li>
            ) : (
              <>
                <Link href={PROFILE_ROUTE}>
                <li onClick={() => setMenuOpen(false)} className="py-1.5 cursor-pointer text-black font-bold  hover:text-white">
                    Личный кабинет
                  </li>
                </Link>
                <li onClick={() => { handleLogout(); setMenuOpen(false); }} className="py-1.5 cursor-pointer text-black font-bold  hover:text-white">
                  Log out
                </li>
              </>
            )}
          </ul>
        </div>
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
"use client";
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';
import { getUserData, updateUser } from '@/lib/firebase/firebaseFunctions';
import React, { ChangeEventHandler, useEffect, useState } from 'react';
import Link from 'next/link';
import { HOME_ROUTE } from '@/constants/routes';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FaCheck, FaPen, FaSpinner } from 'react-icons/fa';
import { useAppSelector } from '../redux/hooks';
import { useRouter } from 'next/navigation';
import { uploadImageToStorage } from '@/lib/firebase/firebaseConfig';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { falseToggle, trueToggle } from '@/redux/slices/toggleSlice';
import { savePsychologistForUser, removeSavedPsychologistForUser } from '@/lib/firebase/firebaseFunctions';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import icon from '../../public/iconPsy.png';

interface User {
  id: string;
  photo?: string;
}

export function fetchUserData(slug: any) {
  return fetchDoc('users', slug);
}

const ClientAccount = () => {
  const [userData, setUserData] = useState<any>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [editedRole, setEditedRole] = useState<string>('user');
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const userName = useAppSelector((state) => state.auth.user?.name);
  const [userPhoto, setUserPhoto] = useState('/default_avatar.jpg');
  const params = useParams();
  const userSlug: any = params.slug;
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [loadStatus, setLoadStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>(null);
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    async function fetchUserData(userId: any) {
      try {
        const fetchedUserData: any = await fetchDoc('users', userId);
        setUserData(fetchedUserData);
        setEditedName(fetchedUserData.name || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    if (userSlug) {
      fetchUserData(userSlug);
    }
  }, [userSlug]);

  useEffect(() => {
    if (userId) {
      getUserData(userId).then((userData) => {
        setUserPhoto(userData.photo || '/defaultPhoto.jpg');
        setIsLoading(false);
      });
    }
  }, [userId]);

  const changeImage = async () => {
    try {
      let newImageUrl = userData?.photo;

      if (image) {
        try {
          dispatch(trueToggle());
          setLoadStatus('Изображение загружается. Пожалуйста, подождите...');
          const imageUrl = await uploadImageToStorage(image);
          if (imageUrl) {
            newImageUrl = imageUrl;
            await updateUser(userSlug, { photo: imageUrl });
            setUserData((prevUserData: any) => ({
              ...prevUserData,
              photo: imageUrl,
            }));

            setImageUrl(imageUrl);
            dispatch(falseToggle());
            setLoadStatus('Изображение загружено.');

            setTimeout(() => {
              setLoadStatus(null);
            }, 3000);
          }
        } catch (error) {
          console.error('Ошибка при обновлении фотографии:', error);
          return;
        }
      }
      const updatedUserData = {
        photo: newImageUrl,
      };

      await updateUser(userSlug, updatedUserData);

      setUserData({
        ...userData,
        ...updatedUserData,
      });
      setIsEditingImage(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const changeNickName = async () => {
    try {
      const updatedUserData = {
        name: editedName,
      };

      await updateUser(userSlug, updatedUserData);

      setUserData({
        ...userData,
        ...updatedUserData,
      });
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const changeRole = async () => {
    try {
      const updatedUserData = {
        role: editedRole,
      };
      dispatch(trueToggle());
      await updateUser(userSlug, updatedUserData);

      setUserData({
        ...userData,
        ...updatedUserData,
      });
      setIsEditingRole(false);
      window.location.reload();
      dispatch(falseToggle());
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsSmallScreen(screenWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onChangeImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = async(url: string) => {
    if (userData?.savedQuestions && userData.savedQuestions.length > 0) {
      const questionSlugs = `/questions/${url}`;
      try {
        await router.push(questionSlugs);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  const handlePsyClick = async (slug: string) => {
    if (userData) {
      const psyProfileUrl = `/profile/${slug}`;
      try {
        await router.push(psyProfileUrl);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    } else {
      console.error('No userData available');
    }
  };

  return (
    userData && userData?.role == 'user' && (
      <>
        <div className="container mx-auto px-4 py-4 max-w-7xl mt-[-40px] justify-center">
          <div className="flex flex-wrap -mx-1 lg:-mx-1 xs:mx-1 s:mx-2 md:mx-3 ">
            <div className="w-full p-3 mx-auto mt-[-3px] lg:mt-[-3px] bg-white rounded-2xl shadow-2xl border xs:py-3 my-5 m-0 md:py-0 md:py-3-lg lg:py-3-md xl:py-3-2xl questions-lg questions-small questions-laptop questions-laptop-small ">
              <div className="w-full p-1 ">
                <p className="font-semibold text-gray-800 leading-6  ">
                  Сохраненные видео:
                </p>
                {userData && userData.savedVideos && (
                  <div className="flex flex-wrap justify-center gap-2 ">
                    {userData.savedVideos.length > 0 ? (
                      userData.savedVideos.map((video: any, index: number) => (
                        <div key={index} className="cursor-pointer border-2 rounded-2xl overflow-hidden pb-3 bg-gray-200 xs:h-[200px] s:h-[200px]  md:h-[180px] xl:h-[180px]"
                          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                          <iframe
                            width="100%"
                            height="100px"
                            src={video}
                            title={video.title}
                            className="w-full h-1 sm:h-56 lg:h-72 s:h-[200px] xs:h-[200px] md:h-[200px] xl:h-[200px]"
                            allowFullScreen
                          ></iframe>
                          <p className="text-sm mt-2">{video.title}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">Пока нет сохраненных видео.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
        
            <div className="container mt-[-1px] md:ml-[20px]  lg:ml-[40px] xl:ml-0 sm:mx-2 px-2 py-4 max-w-3xl bg-white shadow-xl rounded-2xl xs:container-min card-small xl:w-[600px] containerPsy-laptop containerPsy-laptop-small ">
              <div className=" flex justify-center items-start ml-5 photo-block">
                <div className="relative mb-4">
                  <div className="mt-2 mr-5 w-[180px] h-[180px]">
                    {isLoading ? (
                      <div className="flex justify-center items-center w-full h-full">
                        <svg
                          aria-hidden="true"
                          className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.195 1.69328 37.7584 4.19778 38.3955 6.62326C39.0327 9.04873 41.5052 10.4715 44.0646 10.1071C47.8223 9.56811 51.6279 9.52643 55.4218 10.0007C60.6271 10.6598 65.6269 12.4122 70.1061 15.1917C74.5854 17.9712 78.4486 21.716 81.524 26.207C83.7975 29.4527 85.4933 33.0629 86.5483 36.8895C87.3195 39.4934 89.9678 40.8845 92.4111 40.1664C92.4703 40.1486 92.5292 40.1301 92.5877 40.1109C93.0689 39.9506 93.5218 39.7318 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <Image
                        src={
                          isEditingImage
                            ? filePreview || imageUrl || userData?.photo || '/default_avatar.jpg'
                            : userData?.photo || '/default_avatar.jpg'
                        }
                        alt="User Avatar"
                        width={180}
                        height={180}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>

                  {isEditingImage && (
                    <div className="flex flex-col">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onChangeImage}
                        className="border border-green-500 font-semibold text-[9px] leading-6 p-1 mb-2 w-[11.2rem] "
                        disabled={!isEditingImage}
                      />
                    </div>
                  )}

                  <div className="text-center mb-5 ">
                    {userId === userData.slug && (
                      <>
                        {isEditingImage ? (
                          <button
                            className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm mt-5 ml-1"
                            onClick={changeImage}
                          >
                            Сохранить изменения
                          </button>
                        ) : (
                          <button
                            className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm mt-5 ml-1"
                            onClick={() => setIsEditingImage(!isEditingImage)}
                          >
                            Изменить изображение
                          </button>
                        )}
                      </>
                    )}

                    {loadStatus && (
                      <p className="text-gray-500 text-sm mt-2 flex items-center">
                        {loadStatus === 'Изображение загружается. Пожалуйста, подождите...' ? (
                          <FaSpinner className="animate-spin mr-2" />
                        ) : (
                          <FaCheck className="text-green-500 mr-2" />
                        )}
                        {loadStatus}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex ml-3 items-start">
                  <div className="flex flex-col flex-grow profile-info">
                    <div className="flex justify-between items-center p-1 profile-info name">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className={`border ${isEditingName ? 'border-green-500 ml-[3px]' : 'border-none'} font-semibold text-gray-800 p-1 bg-white xs:w-[90%] xs:text-base sm:text-lg md:text-lg lg:text-lg `}
                        disabled={!isEditingName}
                        maxLength={20}
                      />
                    </div>

                    <div className="mb-5 w-full">
                      {userId === userData.slug && (
                        <>
                          {isEditingName ? (
                            <button
                              className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm mt-5 ml-1"
                              onClick={changeNickName}
                            >
                              Сохранить изменения
                            </button>
                          ) : (
                            <button
                              className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm mt-5 ml-1"
                              onClick={() => setIsEditingName(!isEditingName)}
                            >
                              Изменить никнейм
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    <div className=" p-1 lg:w-[300px] md:w-[300px] ">
                      <p className="font-semibold text-gray-800 leading-6 mt-3 mx-3">
                        Сохранненные вопросы:
                      </p>
                      {userData && userData.savedQuestions && (
                        <ul className="text-gray-600 leading-6 mt-2 mx-3">
                          {userData.savedQuestions.length > 0 ? (
                            userData.savedQuestions.map((question: any, index: number) => (
                              <li
                                key={index}
                                onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) => handleClick(`${question.slug}`)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e: React.KeyboardEvent<HTMLLIElement>) => e.key === 'Enter' && handleClick(`${question.slug}`)}
                                className="my-3"
                              >
                                <hr /> {question.title}
                              </li>
                            ))
                          ) : (
                            <li>Пока нет сохраненных вопросов.</li>
                          )}
                        </ul>
                      )}
                    </div>

                    {userId === userData.slug && (
                      <>
                        <div className="mb-5 w-full">

                          <>
                            {isEditingRole ? (
                              <button
                                className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm mt-5 ml-1"
                                onClick={changeRole}
                              >
                                Сохранить изменения
                              </button>
                            ) : (
                              <button
                                className="text-white bg-gray-500 hover:bg-blue-500 py-1 px-2 rounded-2xl uppercase font-semibold xs:text-xs sm:text-sm md:text-sm lg:text-sm mt-5 ml-1"
                                onClick={() => setIsEditingRole(!isEditingRole)}
                              >
                                Изменить роль
                              </button>
                            )}
                          </>

                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="psy"
                              checked={editedRole === 'psy'}
                              onChange={(e) => setEditedRole(e.target.value)}
                              className={`form-radio text-blue-600 h-4 w-4 ${isEditingRole ? 'border-green-500' : ''}`}
                              disabled={!isEditingRole}
                            />
                            <span className="ml-2">Психолог</span>
                          </label>
                        </div>
                        <div className="flex justify-between items-center">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="user"
                              checked={editedRole === 'user'}
                              onChange={(e) => setEditedRole(e.target.value)}
                              className={`form-radio text-blue-600 h-4 w-4 ${isEditingRole ? 'border-green-500' : ''}`}
                              disabled={!isEditingRole}
                            />
                            <span className="ml-2">Клиент</span>
                          </label>
                        </div>
                      </>

                    )}





                  </div>
                </div>
              </div>
            </div>
            <div className="w-full p-3 mx-auto mt-[3px] lg:mt-[3px] bg-white rounded-2xl shadow-2xl border xs:py-3 my-5 m-0 md:py-0 md:py-3-lg lg:py-3-md xl:py-3-2xl questions-lg questions-small questions-laptop questions-laptop-small ">
              <div className="w-full p-1 ">
                <p className="font-semibold text-gray-800 leading-6 mt-3 mx-3">
                  Сохранненные психологи:
                </p>
                 {userData.savedPsy.length > 0 ? (
        userData.savedPsy.map((psy: any, index: number) => (
          <div key={index} className="text-center cursor-pointer">
             <div
              onClick={() => handlePsyClick(psy.psySlug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handlePsyClick(psy.psySlug)}
              className="flex items-center cursor-pointer"
            >
              <Image
                src={psy.psyPhoto || '/defaultPhoto.jpg'}
                alt="Psy Photo"
                width={50}
                height={50}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <p className="font-semibold text-black flex items-center bg-gray-200 rounded-2xl p-1">
                {psy.psyName}
                <Image src={icon} alt="Psy Icon" width={20} height={20} className="ml-1" />
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">Пока нет сохраненных психологов.</p>
      )}


              </div>
            </div>

            {!userData && (
              <div className="flex justify-center">
                <Link href={HOME_ROUTE}>
                  <button className="mt-4 px-6 py-2 font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-blue-600 xs:text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm">
                    Вернуться на главную
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </>
    )
  );
};

export default ClientAccount;

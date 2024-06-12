'use client';
import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons';
// import { faBookmark as faRegularBookmark } from '@fortawesome/free-regular-svg-icons';
import { addVideoToCollection, removeVideoFromCollection, saveVideoForUser, removeSavedVideoForUser } from '@/lib/firebase/firebaseFunctions';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';
import { useAppSelector } from '@/redux/hooks';
import { transformYouTubeUrl } from '@/helpers/transformYouTubeUrl';
import { useParams } from 'next/navigation';

const PsychologistDashboard = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [users, setUsers] = useState<string[]>([]);
  const [savedVideos, setSavedVideos] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
  const userId = useAppSelector(state => state.auth.user?.id);
  const role = useAppSelector(state => state.auth.user?.role);
  const params = useParams();
  const userSlug: any = params.slug;

  useEffect(() => {
    async function loadVideos() {
      const fetchedUsers: any = await fetchDataFromCollection('users');
      const profileUser = fetchedUsers.find((user: any) => user.id === userSlug);
      if (profileUser) {
        setUsers(profileUser.video || []);
      }

      if (userId) {
        const currentUser = fetchedUsers.find((user: any) => user.id === userId);
        if (currentUser) {
          setSavedVideos(currentUser.savedVideos || []);

          const savedVideosFromStorage = localStorage.getItem('savedVideos');
          if (savedVideosFromStorage) {
            setSavedVideos(JSON.parse(savedVideosFromStorage));
          }
        }
      }
    }

    loadVideos();
  }, [userSlug, userId]);

  const addVideo = async () => {
    if (videoUrl.trim() !== '') {
      const embedUrl = transformYouTubeUrl(videoUrl);

      try {
        await addVideoToCollection(embedUrl, userId);
        setVideoUrl('');
        setUsers(prevUsers => [...prevUsers, embedUrl]);
      } catch (error) {
        console.error('Не удалось добавить видео:', error);
      }
    }
  };

  const removeVideo = async (url: string) => {
    try {
      await removeVideoFromCollection(url, userId);
      setUsers(users.filter(u => u !== url));
    } catch (error) {
      console.error('Не удалось удалить видео:', error);
    }
  };

  const saveVideo = async (url: string) => {
    try {
      await saveVideoForUser(url, userId);
      setSavedVideos(prevSavedVideos => [...prevSavedVideos, url]);
      localStorage.setItem('savedVideos', JSON.stringify([...savedVideos, url]));
    } catch (error) {
      console.error('Не удалось сохранить видео:', error);
    }
  };

  const removeSavedVideo = async (url: string) => {
    try {
      await removeSavedVideoForUser(url, userId);
      setSavedVideos(savedVideos.filter(u => u !== url));
      localStorage.setItem('savedVideos', JSON.stringify(savedVideos.filter(u => u !== url)));
    } catch (error) {
      console.error('Не удалось удалить сохранённое видео:', error);
    }
  };

  const openModal = (url: string) => {
    setSelectedVideoUrl(url);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const containerStyle: React.CSSProperties = {
    maxHeight: '800px',
    overflowY: 'auto'
  };

  return (
    <>
      <div className='p-3 m-4 bg-white rounded-2xl shadow-xl border mt-[-3px]'>
        {role === 'psy' && userId === userSlug && (
          <>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter video URL"
              className="border p-2 w-full mt-4"
            />
            <button onClick={addVideo} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mt-2">
              Добавить видео
            </button>
          </>
        )}
      </div>
      <div className="p-3 m-4 bg-white rounded-2xl shadow-xl border mt-[-3px]" style={containerStyle}>
        <div className="flex flex-wrap justify-center gap-2">
          {users.map((url, index) => (
            <div key={index} className="p-1 w-full">
              <div className="cursor-pointer border-2 rounded-2xl overflow-hidden pb-3 bg-gray-200"
                style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}
                onClick={() => openModal(url)}>
                <iframe
                  width="100%"
                  height="150"
                  src={url}
                  title="YouTube video player"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
              <div className="flex justify-between items-center mt-2">
                {role === 'psy' && userId === userSlug && (
                  <button onClick={() => removeVideo(url)} className="bg-red-300 text-white font-bold rounded hover:bg-red-500 p-2">
                    Удалить
                  </button>
                )}
                {role !== 'psy' && (
                  <FontAwesomeIcon
                    icon={savedVideos.includes(url) ? faSolidBookmark : faRegularBookmark}
                    className={`text-2xl cursor-pointer ${savedVideos.includes(url) ? 'text-yellow-500' : 'text-gray-400'}`}
                    onClick={() => savedVideos.includes(url) ? removeSavedVideo(url) : saveVideo(url)}
                  />
                )}
              </div>
              {index < users.length - 1 && (
                <div className="border-b-2 border-gray-700 my-2"></div>
              )}
            </div>
          ))}
        </div>
        {isOpen && (
          <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
              <div className="min-h-screen px-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <iframe
                      width="100%"
                      height="300"
                      src={selectedVideoUrl}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        onClick={closeModal}
                      >
                        Закрыть
                      </button>
                      <a
                        href={`https://www.youtube.com/watch?v=${selectedVideoUrl.split("/embed/")[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 text-blue-500 hover:underline"
                      >
                        Перейти в YouTube
                      </a>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        )}
      </div>
    </>
  );
};

export default PsychologistDashboard;

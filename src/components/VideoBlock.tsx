"use client"

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState, useEffect } from 'react';
import { Video } from '@/interfaces/collections';
import { RootState } from '@/redux/store';
import { getUserData } from '@/lib/firebase/firebaseFunctions';
import { useSelector } from 'react-redux';
import { saveVideoForUser, removeSavedVideoForUser } from '@/lib/firebase/firebaseFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faRegularBookmark } from '@fortawesome/free-regular-svg-icons';

interface VideoBlockProps {
  videos: Video[];
  userRole: 'user' | 'psy';
  updateVideo: (video: Video) => void;
}

export const VideoBlock = ({ videos }: VideoBlockProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
  const [displayCount, setDisplayCount] = useState(4);
  const [flaggedVideos, setFlaggedVideos] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const isToggle = useSelector((state: RootState) => state.toggle.isToggle);
  const [savedVideos, setSavedVideos] = useState<string[]>([]);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    const flaggedVideosFromStorage = localStorage.getItem('flaggedVideos');
    if (flaggedVideosFromStorage) {
      setFlaggedVideos(JSON.parse(flaggedVideosFromStorage));
    }
  }, []);

  useEffect(() => {
    const savedVideosFromStorage = localStorage.getItem('savedVideos');
    if (savedVideosFromStorage) {
      setSavedVideos(JSON.parse(savedVideosFromStorage));
    }
  }, []);

  const openModal = (videoUrl: string): void => {
    setSelectedVideoUrl(videoUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const loadMoreVideos = () => {
    setDisplayCount(prevDisplayCount => prevDisplayCount + 1);
  };

  const collapseVideos = () => {
    setDisplayCount(4);
  };

  const toggleFlag = (videoUrl: string) => {
    const updatedFlaggedVideos = flaggedVideos.includes(videoUrl)
      ? flaggedVideos.filter(v => v !== videoUrl)
      : [...flaggedVideos, videoUrl];
    setFlaggedVideos(updatedFlaggedVideos);
    localStorage.setItem('flaggedVideos', JSON.stringify(updatedFlaggedVideos));
  };

  const saveVideo = async (url: string) => {
    try {
      await saveVideoForUser(url, userId!);
      const updatedSavedVideos = [...savedVideos, url];
      setSavedVideos(updatedSavedVideos);
      localStorage.setItem('savedVideos', JSON.stringify(updatedSavedVideos));
    } catch (error) {
      console.error('Не удалось сохранить видео:', error);
    }
  };

  const removeSavedVideo = async (url: string) => {
    try {
      await removeSavedVideoForUser(url, userId!);
      const updatedSavedVideos = savedVideos.filter(u => u !== url);
      setSavedVideos(updatedSavedVideos);
      localStorage.setItem('savedVideos', JSON.stringify(updatedSavedVideos));
    } catch (error) {
      console.error('Не удалось удалить сохранённое видео:', error);
    }
  };

  useEffect(() => {
    console.log("Role changed:", role);
    console.log("Saved videos:", savedVideos);
  }, [role, savedVideos]);

  useEffect(() => {
    if (userId) {
      getUserData(userId).then((userData) => {
        setRole(userData.role);
      });
    }
  }, [userId, isToggle]);

  return (
    <div className="p-3 m-4 bg-white rounded-2xl shadow-2xl border mt-[-1px]">
      <div className="flex flex-wrap justify-center gap-2">
        {videos.slice(0, displayCount).map((videoGroup, index) => (
          <Fragment key={index}>
            {videoGroup.video.map((url, urlIndex) => (
              <div key={`${index}-${urlIndex}`} className="w-full p-1">
                <div className="cursor-pointer border-2 pb-2 rounded-2xl overflow-hidden relative" onClick={() => openModal(url)}>
                  <iframe
                    width="100%"
                    height="150"
                    src={url}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                  {flaggedVideos.includes(url) && (
                    <div className="absolute top-2 right-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-yellow-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        onClick={() => toggleFlag(url)}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  <div className="flex justify-end mt-2 absolute bottom-2 right-2">
                  </div>
                </div>
                {userId && (
                      <FontAwesomeIcon
                        icon={savedVideos.includes(url) ? faSolidBookmark : faRegularBookmark}
                        className={`text-2xl cursor-pointer ${savedVideos.includes(url) ? 'text-yellow-500' : 'text-gray-400'}`}
                        onClick={() => savedVideos.includes(url) ? removeSavedVideo(url) : saveVideo(url)}
                      />
                    )}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
      {videos.reduce((acc, curr) => acc + curr.video.length, 0) > 4 && (
        <div className="flex justify-center mt-4">
          {displayCount < videos.reduce((acc, curr) => acc + curr.video.length, 0) ? (
            <button
              type="button"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
              onClick={loadMoreVideos}
            >
              Еще
            </button>
          ) : (
            <button
              type="button"
              className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
              onClick={collapseVideos}
            >
              Свернуть
            </button>
          )}
        </div>
      )}
      {isOpen && (
        <Transition.Root show={isOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
              </Transition.Child>
              <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
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
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
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
  );
};

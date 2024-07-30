"use client"

import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { saveVideoForUser, removeSavedVideoForUser } from '@/lib/firebase/firebaseFunctions';
import { useAppSelector } from '@/redux/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faRegularBookmark } from '@fortawesome/free-regular-svg-icons';
import { RootState } from '@/redux/store';
import { getUserData } from '@/lib/firebase/firebaseFunctions';
import ReactPlayer from 'react-player';

interface Video {
  url: string;
}
type Props = {
  videosData: Video[]
}

const VideoGallery = ({ videosData, topicVideos }: any) => {
  const [videos, setVideos] = useState<Video[]>(() => videosData);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [displayCount, setDisplayCount] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedVideos, setSavedVideos] = useState<string[]>([]);
  const userId = useAppSelector(state => state.auth.user?.id);
  const [role, setRole] = useState('');
  const dispatch = useDispatch();
  const isToggle = useSelector((state: RootState) => state.toggle.isToggle);

  const loadSavedVideos = () => {
    const saved = localStorage.getItem('savedVideos');
    if (saved) {
      setSavedVideos(JSON.parse(saved));
    } else {
      setSavedVideos([]);
    }
  };

  useEffect(() => {
    const loadVideos = async () => {
      loadSavedVideos();
    };

    loadVideos();
  }, [userId]);

  useEffect(() => {
    if (displayCount >= videos.length) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [displayCount, videos.length]);

  useEffect(() => {
    loadSavedVideos();
  }, [role]);

  const openModal = (videoUrl: string): void => {
    setSelectedVideoUrl(videoUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const loadMoreVideos = () => {
    if (displayCount < videos.length) {
      setDisplayCount(displayCount + 1);
    } else {
      setIsExpanded(true);
    }
  };

  const collapseVideos = () => {
    setDisplayCount(4);
    setIsExpanded(false);
  };

  const saveVideo = async (url: string) => {
    try {
      await saveVideoForUser(url, userId);
      const updatedSavedVideos = [...savedVideos, url];
      setSavedVideos(updatedSavedVideos);
      localStorage.setItem('savedVideos', JSON.stringify(updatedSavedVideos));
    } catch (error) {
      console.error('Не удалось сохранить видео:', error);
    }
  };

  const removeSavedVideo = async (url: string) => {
    try {
      await removeSavedVideoForUser(url, userId);
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
    <div className="p-3 m-4 bg-white rounded-2xl shadow-2xl border mt-[-3px]">
      <div className="flex flex-wrap justify-center gap-2">
        {(topicVideos || videos).slice(0, displayCount).map((video: any, index: number) => {
          return (
            <div key={index} className="w-full p-1">
              <div className="cursor-pointer border-2 pb-2 rounded-2xl overflow-hidden" onClick={() => openModal(video.url)}>
                <ReactPlayer
                  light
                  url={video.url}
                  width="100%"
                  height="150px"
                  title="YouTube video player"
                  className="rounded-lg"
                  allowFullScreen
                  playing
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                {role !== 'psy' && (
                  <FontAwesomeIcon
                    icon={savedVideos.includes(video.url) ? faSolidBookmark : faRegularBookmark}
                    className={`text-2xl cursor-pointer ${savedVideos.includes(video.url) ? 'text-yellow-500' : 'text-gray-400'}`}
                    onClick={() => savedVideos.includes(video.url) ? removeSavedVideo(video.url) : saveVideo(video.url)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {(videos.length > 4) && (
        <div className='flex justify-center mt-2 mb-2'>
          {isExpanded ? (
            <button
              type="button"
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700"
              onClick={collapseVideos}
            >
              Свернуть
            </button>
          ) : (
            <button
              type="button"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
              onClick={loadMoreVideos}
              disabled={displayCount >= videos.length}
            >
              Еще
            </button>
          )}
        </div>
      )}
      {isOpen && (
        <Transition.Root show={isOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <iframe
                    width="100%"
                    height="300"
                    src={selectedVideoUrl}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                  <div className="mt-4 p-4">
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
  );
};

export default VideoGallery;

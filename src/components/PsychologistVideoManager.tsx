'use client';
import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { addVideoToCollection } from '@/lib/firebase/firebaseFunctions';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';
import { useAppSelector } from '@/redux/hooks';
import { transformYouTubeUrl } from '@/helpers/transformYouTubeUrl';
import { useParams } from 'next/navigation';


const PsychologistDashboard = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [users, setUsers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
  const userId = useAppSelector(state => state.auth.user?.id);
  const role = useAppSelector(state => state.auth.user?.role);
  const params = useParams();
  const userSlug: any = params.slug;
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    async function loadVideos() {
      const fetchedUsers: any = await fetchDataFromCollection('users');
      const profileUser = fetchedUsers.find((user: any) => user.id === userSlug)
      if (profileUser) {
        setUsers(profileUser.video);
      }
    }

    loadVideos();
  }, [userSlug]);

  const addVideo = async () => {
    if (videoUrl.trim() !== '') {
      const embedUrl = transformYouTubeUrl(videoUrl);

      try {
        await addVideoToCollection(embedUrl, userId);
        setVideoUrl('');
      } catch (error) {
        console.error('Не удалось добавить видео:', error);
      }
    }
  };

  const openModal = (url: string) => {
    setSelectedVideoUrl(url);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const showMoreVideos = () => {
    setVisibleCount(prevCount => prevCount + 1);
  };

  return (
    <div className="p-3 m-4 bg-white rounded-2xl shadow-2xl border mt-[-3px]">
      <div className="flex flex-wrap justify-center gap-2">
        {users.slice(0, visibleCount).map((url, index) => (
          <div key={index} className="p-1 w-full cursor-pointer border-2 rounded-2xl overflow-hidden" onClick={() => openModal(url)}>
            <iframe
              width="100%"
              height="150"
              src={url}
              title="YouTube video player"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>

        ))}
      </div>
      {users.length > visibleCount && (
        <div className="flex justify-center mt-2 mb-2 ">
          <button onClick={showMoreVideos} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Еще
          </button>
        </div>

      )}
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
  );
};

export default PsychologistDashboard;

import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';

interface Video {
  url: string;
}  

const shuffleArray = (array: any) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
const VideoGallery = () => {
    const [videos, setVideos] = useState<Video[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
 const [displayCount, setDisplayCount] = useState(4);

 useEffect(() => {
  const loadVideos = async () => {
      try {
          const usersData = await fetchDataFromCollection('users');
          let videosData: Video[] = [];

          usersData.forEach((user: any) => {
              if (user.video && user.video.length > 0) {
                  user.video.forEach((videoUrl: string) => {
                      videosData.push({ url: videoUrl });
                  });
              }
          });

          if (!videosData.length) {
              console.log("No videos found");
              return;
          }

          const shuffledVideos = shuffleArray(videosData);
          setVideos(shuffledVideos);
      } catch (error) {
          console.error('Error loading videos:', error);
      }
  };

  loadVideos();
}, []);

  const openModal = (videoUrl: string): void => {
    setSelectedVideoUrl(videoUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const loadMoreVideos = () => {
    const newDisplayCount = displayCount + 1; 
    setDisplayCount(newDisplayCount);
  };
  return (
    <div className="p-3 m-4 bg-white rounded-2xl shadow-2xl border mt-[-3px]">
      <div className="flex flex-wrap justify-center gap-2">
      {videos.slice(0, displayCount).map((video, index) => {
    if (video) {  
      console.log(video.url);  
    } else {
      console.log("Video data is not loaded yet");  
    }
    return (
      <div key={index} className="w-full p-1">
        <div className="cursor-pointer border-2 pb-2 rounded-2xl overflow-hidden" onClick={() => openModal(video.url)}>
          <iframe
            width="100%"
            height="150"
            src={video.url}
            title="YouTube video player"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    );
  })}
      </div>
      <div className=' flex justify-center'>
       <button
        type="button"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 "
        onClick={loadMoreVideos}
      >
        Еще
      </button>
      </div>

      {isOpen && (
        <Transition.Root show={isOpen} as={React.Fragment}>
          <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
              <Transition.Child
                as={React.Fragment}
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
                      className="ml-4 text-blue-500 hover:underline "
                    >
                      Перейти
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

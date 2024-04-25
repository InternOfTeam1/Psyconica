import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';

interface Video {
    title?: string; 
    url: {
      url: string[];
    };
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
 

  useEffect(() => {
    const loadVideos = async () => {

        try {
            const videosData = await fetchDataFromCollection('videos');
            console.log("Loaded videos:", videosData);
            if (!videosData.length) {
                
              console.log("No videos found");
              return; 
            }
            const shuffledVideos = shuffleArray(videosData).slice(0, 4);
            setVideos(shuffledVideos);
          } catch (error) {
            console.error('Error loading videos:', error);
            return;
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

  return (
    <div className="p-3 m-4 bg-white rounded-2xl shadow-2xl border mt-[-3px]">
        
      <div className="flex flex-wrap justify-center gap-2">
         
        {videos.map((video, index) => (
      
          <div key={index} className="w-full p-1">
            <div className="cursor-pointer border-2 pb-2 rounded-2xl overflow-hidden" onClick={() => openModal(video.url?.url?.[0])}>
              <iframe
                width="100%"
                height="150"
                src={video.url?.url?.[0]}
                title="YouTube video player"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        ))}
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
                      className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <a
                      href={`https://www.youtube.com/watch?v=${selectedVideoUrl.split("/embed/")[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 text-blue-500 hover:underline"
                    >
                      Watch on YouTube
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

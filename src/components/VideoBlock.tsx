import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { Video } from '@/interfaces/collections';

interface VideoBlockProps {
  videos: Video[];
  userRole: 'user' | 'psy';
  updateVideo: (video: Video) => void;
}

export const VideoBlock = ({ videos }: VideoBlockProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');

  const openModal = (videoUrl: string): void => {
    setSelectedVideoUrl(videoUrl);
    setIsOpen(true);
  };

  const renderIframe = (url: string, width: string, height: string) => (
    <iframe
      width={width}
      height={height}
      src={url}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="rounded-lg"
    ></iframe>
  );

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="p-3 m-4 bg-white rounded-2xl shadow-2xl border mt-[-1px]">
      <div className="flex flex-wrap justify-center gap-2">
        {videos.map((video, index) => video.video && video.video.map((url, urlIndex) => (
          <div key={`${index}-${urlIndex}`} className="w-full p-1">
            <div className="cursor-pointer border-2 pb-2 rounded-2xl overflow-hidden" onClick={() => openModal(url)}>
              {renderIframe(url, "100%", "150")}
            </div>
          </div>
        )))}
      </div>
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
                      Close
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

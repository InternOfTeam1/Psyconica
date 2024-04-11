import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { Video } from '@/interfaces/collections'; 

interface VideoBlockProps {
  videos: Video[];
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
console.log(selectedVideoUrl.split("/embed/")[1])
  return (
    <div className="p-3 m-4 bg-white rounded-2xl shadow-2xl border"> 
      <div className="flex flex-wrap justify-center gap-2"> 
        {videos.map((video, index) => (
          video.video.map((url, urlIndex) => (
            <div key={`${index}-${urlIndex}`} className="w-full  p-1 "> 
             <div className="cursor-pointer border-2 pb-2 rounded-2xl overflow-hidden" onClick={() => openModal(url)}>
                {renderIframe(url, "101%", "150")} 
              </div>
            </div>
          ))
        ))}
      </div>
      {isOpen && (
  <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
    <Dialog.Panel className="m-4 bg-white  mx-auto">
      {renderIframe(selectedVideoUrl, "200%", "400")}
      <div className="text-center mt-4">
        <a href={`https://www.youtube.com/watch?v=${selectedVideoUrl.split("/embed/")[1]}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Перейти в ютуб
        </a>
      </div>
    </Dialog.Panel>
  </Dialog>
)}
    </div>
  );
};

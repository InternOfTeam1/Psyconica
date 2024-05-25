import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="fixed bg-white p-4 rounded w-11/12 xs:w-3/4 s:w-2/3 sm:w-1/2 md:w-2/5 lg:w-1/3 xl:w-1/4 2xl:w-1/5 tablet:w-1/3 transform -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2">
        <button className="absolute top-0 right-0 m-2 text-gray-600 hover:text-gray-800" onClick={onClose}></button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

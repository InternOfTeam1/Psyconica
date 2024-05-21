import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <button className="absolute top-0 right-0 m-4" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile, setUserRole } from '../redux/slices/authSlice';
import { AppDispatch } from '../redux/store';
import { useAppSelector } from '../redux/hooks';
import Cookies from 'js-cookie';
import { updateUserDataInFirebase } from '../lib/firebase/firebaseFunctions';
import { setUserState } from '../redux/slices/authSlice';
import { fetchDoc } from '@/lib/firebase/firebaseGetDocs';


const PsychologistModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isPsychologist, setIsPsychologist] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [userData, setUserData] = useState<any>(null);


  useEffect(() => {
    async function fetchUserData(userId: any) {
      try {
        const fetchedUserData: any = await fetchDoc('users', userId);
        setUserData(fetchedUserData);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    if (userId) {
      fetchUserData(userId);
    }

  }, [userId]);



  const handleSelection = async (value: boolean) => {
    if (!userId) {
      console.error('User ID not found.');
      return;
    }

    setIsPsychologist(value);
    setConfirmationVisible(true);

    await updateUserDataInFirebase(userId, { role: value ? 'psy' : 'user' });

    dispatch(updateUserProfile({ userId, isPsychologist: value }));

    if (userData) {

      const updatedUser = {
        ...userData,
        role: value ? 'psy' : 'user',
      };
      dispatch(setUserState(updatedUser));
    }

    setTimeout(() => {
      setConfirmationVisible(false);
    }, 3000);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto">
            <h3 className="font-semibold text-lg">Кем вы являетесь?</h3>
            <p className="text-gray-700">Выберите один из вариантов:</p>

            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600"
                  checked={!isPsychologist}
                  onChange={() => handleSelection(false)}
                />
                <span className="ml-2">Я клиент</span>
              </label>
            </div>

            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600"
                  checked={isPsychologist}
                  onChange={() => handleSelection(true)}
                />
                <span className="ml-2">Я психолог</span>
              </label>
            </div>


            {confirmationVisible && (
              <div className="mt-4 text-green-500 text-sm">Выбор сохранен.</div>
            )}

            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black" onClick={onClose}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={onClose}></div>
      )}
    </>
  );
};

export default PsychologistModal;

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile, setUserRole } from '../redux/slices/authSlice';
import { AppDispatch } from '../redux/store';
import { useAppSelector } from '../redux/hooks';
import Cookies from 'js-cookie';
import { updateUserDataInFirebase } from '../lib/firebase/firebaseFunctions'; 
import { setUserState } from '../redux/slices/authSlice';

const PsychologistModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    const isPsychologistCookie = Cookies.get("isPsychologist");
    if (userId && isPsychologistCookie) {
      setIsChecked(isPsychologistCookie === "true");
    } else {
      setIsChecked(false);
    }
    dispatch(setUserRole(isPsychologistCookie === "true" ? 'psy': 'user')) 
  }, [isOpen, userId]);

  const handleCheckboxChange = async () => {
    if (!userId) {
      console.error('ID пользователя не найден');
      return;
    }
    const newIsPsychologistValue = !isChecked;
    setIsChecked(newIsPsychologistValue);
    const expirationDays = 7;
    Cookies.set('isPsychologist', String(newIsPsychologistValue), { expires: expirationDays });
    await updateUserDataInFirebase(userId, { role: newIsPsychologistValue ? 'psy' : 'user' });
    dispatch(updateUserProfile({ userId, isPsychologist: newIsPsychologistValue }));
    const userCookie = Cookies.get('user');
    if(userCookie){
      const user = JSON.parse(userCookie as string);
      const updatedUser = {
        ...user, 
        role: newIsPsychologistValue ? 'psy' : 'user'
      }
      dispatch(setUserState(updatedUser));
      Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });
      console.log(JSON.parse(userCookie as string))
    }
  };


  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto">
          <h3 className="font-semibold text-lg">Вы психолог?</h3>
          <p className="text-gray-700">Если вы являетесь психологом, отметьте пожалуйста:</p>
          
          <div className="mt-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-indigo-600" checked={isChecked} onChange={handleCheckboxChange}/>
              <span className="ml-2">Я психолог</span>
            </label>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black" onClick={onClose}>Закрыть</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PsychologistModal;

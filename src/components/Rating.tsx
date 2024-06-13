import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { db } from '@/lib/firebase/firebaseConfig';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Modal from '../components/ModalRating'; 

interface RatingStarsProps {
  userSlug: string;
  currentRating: number;
  setRating: (newRating: number) => void;
  userId: string; 
}

interface UserData {
  ratings: { [key: string]: number };
  averageRating?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ userSlug, currentRating, setRating, userId }) => {
  const totalStars = 5;
  const [hoverRating, setHoverRating] = useState(0);
  const [userHasRated, setUserHasRated] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showRemoveRatingModal, setShowRemoveRatingModal] = useState(false);

  useEffect(() => {
    const checkUserRating = async () => {
      const userDocRef = doc(db, "users", userSlug);
      const userData = await getDoc(userDocRef);
      if (userData.exists()) {
        const user = userData.data() as UserData;
        const userRatings = user.ratings || {};
        if (userRatings[userId]) {
          setUserHasRated(true);
        }
      }
    };

    checkUserRating();
  }, [userSlug, userId]);

  const handleUpdateRating = async (slug: string, newRating: number, userId: string) => {
    const userDocRef = doc(db, "users", slug);
    const userData = await getDoc(userDocRef);
    if (userData.exists()) {
      const user = userData.data() as UserData;
      const userRatings = user.ratings || {};
      if (userRatings[userId]) {
        console.error("User has already rated!");
        setShowRemoveRatingModal(true);
        return;
      }
      userRatings[userId] = newRating;
      const ratingsArray = Object.values(userRatings) as number[];
      const averageRating = ratingsArray.reduce((acc: number, cur: number) => acc + cur, 0) / ratingsArray.length;
      
      await updateDoc(userDocRef, {
        ratings: userRatings,
        averageRating
      });
      setRating(averageRating);
      setUserHasRated(true);
      setShowThankYouModal(true);
    } else {
      console.error("Document does not exist!");
    }
  };

  const handleRemoveRating = async () => {
    const userDocRef = doc(db, "users", userSlug);
    const userData = await getDoc(userDocRef);
    if (userData.exists()) {
      const user = userData.data() as UserData;
      const userRatings = user.ratings || {};
      
      delete userRatings[userId];
      const ratingsArray = Object.values(userRatings) as number[];
      const averageRating = ratingsArray.length > 0 
        ? ratingsArray.reduce((acc: number, cur: number) => acc + cur, 0) / ratingsArray.length 
        : 0;
      
      await updateDoc(userDocRef, {
        ratings: userRatings,
        averageRating
      });
      setRating(averageRating);  
      setUserHasRated(false);
      setHoverRating(0);  
      setShowRemoveRatingModal(false);
    } else {
      console.error("Document does not exist!");
    }
  };

  const handleRating = async (index: number) => {
    if (userHasRated) {
      setShowRemoveRatingModal(true);
      return;
    }
    const newRating = index + 1;
    await handleUpdateRating(userSlug, newRating, userId);
  };

  const getStarIcon = (index: number) => {
    if (hoverRating > 0 && !userHasRated) {
      return index < hoverRating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-400" />;
    }
    if (index < Math.floor(currentRating)) {
      return <FaStar className="text-yellow-400" />;
    }
    if (index < currentRating) {
      return <FaStarHalfAlt className="text-yellow-400" />;
    }
    return <FaRegStar className="text-gray-400" />;
  };

  return (
    <div className="flex items-center space-x-2">
      {[...new Array(totalStars)].map((_, index) => (
        <button
          key={index}
          onClick={() => handleRating(index)}
          onMouseEnter={() => !userHasRated && setHoverRating(index + 1)}
          onMouseLeave={() => !userHasRated && setHoverRating(0)}
          className="focus:outline-none"
        >
          {getStarIcon(index)}
        </button>
      ))}
      <span className="text-lg font-medium">({currentRating.toFixed(1)})</span>

      {showThankYouModal && (
        <Modal onClose={() => setShowThankYouModal(false)}>
          <div className="p-6 bg-white rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowThankYouModal(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Спасибо за ваш отзыв!</h2>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowThankYouModal(false)}
            >
              Закрыть
            </button>
          </div>
        </Modal>
      )}

      {showRemoveRatingModal && (
        <Modal onClose={() => setShowRemoveRatingModal(false)}>
          <div className="p-6 bg-white rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowRemoveRatingModal(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Вы хотите отменить свой отзыв?</h2>
            <div className="flex space-x-4 mt-6">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleRemoveRating}
              >
                Да
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowRemoveRatingModal(false)}
              >
                Нет
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default RatingStars;

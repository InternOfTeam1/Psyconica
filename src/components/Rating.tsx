import React, { useState } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { db } from '@/lib/firebase/firebaseConfig';
import { doc, updateDoc, getDoc } from "firebase/firestore";

interface RatingStarsProps {
  userSlug: string;
  currentRating: number;
  setRating: (newRating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({ userSlug, currentRating, setRating }) => {
  const totalStars = 5;
  const [hoverRating, setHoverRating] = useState(0); 

  const handleUpdateRating = async (slug: string, newRating: number) => {
    const userDocRef = doc(db, "users", slug);
    const userData = await getDoc(userDocRef);
    if (userData.exists()) {
      const user = userData.data();
      const ratings = user.ratings ? [...user.ratings, newRating] : [newRating];
      const averageRating = ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length;
      await updateDoc(userDocRef, {
        ratings,
        averageRating
      });
      setRating(averageRating); 
    } else {
      console.error("Document does not exist!");
    }
  };

  const handleRating = async (index: number) => {
    const newRating = index + 1;
    setRating(newRating);
    await handleUpdateRating(userSlug, newRating);
  };

  const getStarIcon = (index: number) => {
    if (hoverRating > 0) {
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
          onMouseEnter={() => setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none"
        >
          {getStarIcon(index)}
        </button>
      ))}
      <span className="text-lg font-medium">({currentRating.toFixed(1)})</span>
    </div>
  );
};

export default RatingStars;

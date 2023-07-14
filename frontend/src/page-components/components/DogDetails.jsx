import React, { useEffect, useState } from 'react';
import dogImage from '../../assets/puppy.png';
import '../../css-components/DogDetails.css';

function DogWeightTrackerDetails({ showPopup, dog }) {
  const dogWeights = dog.weights;
  const lastWeight = dogWeights[dogWeights.length - 1];
  const currentWeight = lastWeight ? lastWeight.weight : null;
  const [formattedLastWeighed, setFormattedLastWeighed] = useState('');
  const [formattedDOB, setFormattedDOB] = useState('');

  async function keepDateOnly(date) {
    const dateFormat = new Date(date);
    return dateFormat.toLocaleDateString('en-GB');
  }

  useEffect(() => {
    const fetchFormattedLastWeighed = async () => {
      if (lastWeight) {
        const formatted = await keepDateOnly(lastWeight.date);
        setFormattedLastWeighed(formatted);
      }
    };

    fetchFormattedLastWeighed();
  }, [lastWeight]);

  useEffect(() => {
    const fetchFormattedDOB = async () => {
      const formatted = await keepDateOnly(dog.dob);
      setFormattedDOB(formatted);
    };

    fetchFormattedDOB();
  }, [dog.dob]);

  return (
    <div className="dog-details">
      <div className="inner-dog-details">
        <img className="dog-image" src={dogImage} alt="Dog" />
        <div className="dog-info">
          <div className="dog-name">{dog.name}</div>
          <div className="breed">{dog.breed}</div>
          <div className="gender">{dog.gender}</div>
        </div>
        <div className="weight-info">
          <div className="current-weight">{currentWeight} kg</div>
          <div className="last-weighed">Last weighed:</div>
          <div>{formattedLastWeighed}</div>
          <div className="dob">Date of Birth:</div>
          <div>{formattedDOB}</div>
        </div>
      </div>
    </div>
  );
}

export default DogWeightTrackerDetails;

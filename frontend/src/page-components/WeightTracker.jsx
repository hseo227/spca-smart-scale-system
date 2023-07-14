import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css-components/WeightTracker.css';
import Chart from 'chart.js/auto';
import WeightTrackerPopUp from './components/WeightTrackerPopUp';
import WeighButton from './components/WeighButton';
import WeightTrackerDogDetails from './components/DogDetails';

async function getDogById(dogId) {
  try {
    const response = await axios.get(`http://localhost:5001/api/dog/${dogId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch dog data: ${error.message}`);
  }
}

function WeightTracker() {
  const { dogId } = useParams();
  const [selectedDog, setSelectedDog] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [weightData, setWeightData] = useState([]);

  const popupContainerRef = useRef(null);

  useEffect(() => {
    // Fetch the dog data based on the dogId parameter
    getDogById(dogId)
      .then((dogData) => {
        setSelectedDog(dogData);
        setWeightData(dogData.weights);
      })
      .catch((error) => {
        console.error('Failed to fetch dog data:', error);
      });
  }, [dogId]);

  useEffect(() => {
    const chart = new Chart(document.getElementById('data-graph'), {
      type: 'line',
      data: {
        labels: weightData.map((row) => row.date),
        datasets: [
          {
            label: 'Weight',
            data: weightData.map((row) => row.weight),
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        responsive: true,
      },
    });

    return () => {
      // Clean up the chart when the component is unmounted
      chart.destroy();
    };
  }, [weightData]);

  const retrieveWeight = () => {
    setShowPopup(true);
  };

  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
  };

  const handleOutsideClick = (e) => {
    if (popupContainerRef.current && !popupContainerRef.current.contains(e.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showPopup]);

  if (!selectedDog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="weight-tracker">
      <WeightTrackerDogDetails showPopup={showPopup} dog={selectedDog} />
      <div className="right-div">
        <canvas id="data-graph"></canvas>
        <WeighButton onClick={retrieveWeight} disabled={showPopup} />
        {showPopup && (
          <div className="popup-container" ref={popupContainerRef}>
            <div className="popup-background" />
            <div className="popup-content">
              <WeightTrackerPopUp
                weightData={weightData}
                handleDropdownChange={handleDropdownChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeightTracker;

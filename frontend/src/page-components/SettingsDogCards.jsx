import { useEffect, useState } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import './styles/SettingsDogCardsStyle.css';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const SettingsDogCards = (props) => {
  const { dog, onDelete } = props;
  const [age, setAge] = useState(0);
  const [centre, setCentre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateAge = (dob) => {
      const dobDate = new Date(dob);
      const currentDate = new Date();

      const yearsDiff = currentDate.getFullYear() - dobDate.getFullYear();
      const monthsDiff = currentDate.getMonth() - dobDate.getMonth();
      const ageInMonths = yearsDiff * 12 + monthsDiff;

      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;

      return { years, months };
    };

    const getCentre = async (centreID) => {
      try {
        const response = await axios.get(`http://localhost:5001/api/centre/${centreID}`);
        console.log(response.data.name);
        return response.data.name;
      } catch (error) {
        console.error('Error:', error);
        return '';
      }
    };

    const fetchData = async () => {
      try {
        const centreName = await getCentre(dog.centre);
        setCentre(centreName);
        setAge(calculateAge(dog.dob));
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dog.centre, dog.dob]);

  const handleEdit = () => {
    return;
  };

  const handleDelete = () => {
    onDelete(dog);
  };

  if (loading) {
    return null; // Render nothing while loading
  }

  return (
    <div className="cardContainer">
      <div className="imageContainer">
        <img src={dog.image} alt={dog.name} />
      </div>
      <div className="cardContentContainer">
        <p className="dogName">{dog.name}</p>
        <p className="dogGender">
          {dog.gender} {dog.breed}
        </p>
        <p className="dogAge">
          {age.years} Years {age.months} Months
        </p>
        <p className="dogCentre">{centre}</p>
      </div>
      <div className="extraButtons">
        <button className="editButton" onClick={handleEdit}>
          <EditIcon />
        </button>
        <button className="deleteButton" onClick={handleDelete}>
          Remove
        </button>
      </div>
    </div>
  );
};

SettingsDogCards.propTypes = {
  dog: PropTypes.shape({
    name: PropTypes.string.isRequired,
    breed: PropTypes.string,
    gender: PropTypes.string,
    dob: PropTypes.string,
    image: PropTypes.string,
    centre: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SettingsDogCards;

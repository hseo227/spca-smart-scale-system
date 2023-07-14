// import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import SettingsDogCards from './SettingsDogCards';
import './styles/SettingsCentreStyle.css';
// import placeholder from './../assets/dog.jpg';
import pageDecoration from './/../assets/pageDecoration.svg';
import AuthenticationContext from './../context/AuthenticationContext';
import axios from 'axios';
function SettingsCentre() {
  const [dogs, setDogs] = useState([]);
  const [scaleNumber, setScaleNumber] = useState(0);
  const [serialNumber, setSerialNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationIsModalOpen] = useState(false);
  const [centre, setCentre] = useState('');
  const [dogToDelete, setDogToDelete] = useState({});
  const { user, getUserIdToken } = useContext(AuthenticationContext);

  useEffect(() => {
    const setStates = async () => {
      try {
        // const token = await getUserIdToken();
        const centreName = await axios.get(`http://localhost:5001/api/user/${user.email}`);
        const centreRes = await axios.get(
          `http://localhost:5001/api/centre/${centreName.data.centre}`
        );
        setCentre(centreRes.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    setStates();
  }, []);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        // const token = await getUserIdToken();
        const response = await axios.get(`http://localhost:5001/api/user/dogs/${user.email}`);
        setDogs(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchDogs();
  }, [getUserIdToken]);

  if (dogs === null) {
    return null;
  }

  useEffect(() => {
    const fetchScaleNumber = async () => {
      try {
        // const token = await getUserIdToken();
        const response = await axios.get(
          `http://localhost:5001/api/centre/next-scale/${centre.name}`
        );
        setScaleNumber(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchScaleNumber();
    console.log(scaleNumber);
  }, [centre, isModalOpen]);

  const handleAddScale = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSerialNumber('');
  };

  const handleSerialNumberChange = (event) => {
    setSerialNumber(event.target.value);
  };

  const handleAddScaleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestBody = {
        serialNumber: serialNumber,
        scaleNumber: scaleNumber.scaleNum,
      };
      // const token = await getUserIdToken();
      await axios.put(`http://localhost:5001/api/centre/scale/${centre._id}`, requestBody);
      await axios.post(`http://localhost:5001/api/scale`, requestBody);
      setSerialNumber('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const deleteDog = async () => {
    try {
      // Perform the delete action using the dogId
      await axios.delete(`http://localhost:5001/api/dog/${dogToDelete._id}`);
      console.log(`Deleting dog: ${dogToDelete._id}`);
      const updatedDogs = dogs.filter((dog) => dog._id !== dogToDelete._id);
      setDogs(updatedDogs);
    } catch (error) {
      console.error('Error:', error);
    }
    setConfirmationIsModalOpen(false);
  };

  const handleDelete = (dog) => {
    setDogToDelete(dog);
    setConfirmationIsModalOpen(true);
  };

  const handleConfirmationModalClose = () => {
    setConfirmationIsModalOpen(false);
  };

  return (
    <div className="pageContainer">
      <div className="pageHeader">
        <h1>My Centre</h1>
        <button className="scaleButton" onClick={handleAddScale}>
          Add a scale <strong>+</strong>
        </button>
      </div>
      <div className="pageContent">
        <div className="column">
          {dogs.map((dog, index) => {
            if (index % 2 === 0) {
              return <SettingsDogCards key={index} dog={dog} onDelete={handleDelete} />;
            } else {
              return null;
            }
          })}
        </div>
        <div className="column">
          {dogs.map((dog, index) => {
            if (index % 2 === 1) {
              return <SettingsDogCards key={index} dog={dog} onDelete={handleDelete} />;
            } else {
              return null;
            }
          })}
        </div>
      </div>
      {isModalOpen && (
        <div className="modalContainer">
          <div className="modalContent">
            <form onSubmit={handleAddScaleSubmit}>
              <button className="closeButton" onClick={handleModalClose}>
                X
              </button>
              <label>
                Scale Serial Number
                <input
                  type="text"
                  value={serialNumber}
                  onChange={handleSerialNumberChange}
                  placeholder="Serial No."
                />
              </label>
              <label>
                Scale Number
                <input type="text" value={scaleNumber.scaleNum} readOnly />
              </label>
              <button className="submitButton" type="submit">
                Add
              </button>
            </form>
          </div>
        </div>
      )}
      {isConfirmationModalOpen && (
        <div className="modalConfirmationContainer">
          <div className="modalConfirmationContent">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete these records. This process can't be undone</p>
            <div className="buttonContainer">
              <button className="cancelButton" onClick={handleConfirmationModalClose}>
                Cancel
              </button>
              <button className="deleteConfirmationButton" onClick={deleteDog}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <img src={pageDecoration} className="backgroundImage" />
    </div>
  );
}

export default SettingsCentre;

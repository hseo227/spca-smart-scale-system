import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useGet from '../hooks/useGet';
import '../css-components/Dashboard.css';
import dogImage from '../assets/puppy.png';
import {
  Dialog,
  DialogContent,
  TextField,
  styled,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import FileDropZone from './FileDropZone';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    padding: '0',
    fontSize: '15px',
    borderRadius: '12px',
  },
  width: '100%',
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const { data: dogs } = useGet(`${BASE_URL}/api/dog`, []);
  const [openAddDogModal, setOpenAddDogModal] = useState(false);
  const [dogName, setDogName] = useState('');
  const [dogDOB, setDogDOB] = useState(Dayjs || null);
  const [dogBreed, setDogBreed] = useState('');
  const [dogGender, setDogGender] = useState('');
  const [dogCentre, setDogCentre] = useState('');
  const [centres, setCentres] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  console.log(dogs); // Log the dogs data to inspect its structure and contents

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  console.log(file);

  useEffect(() => {
    // Fetch centres from the endpoint
    const fetchCentres = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/centre/`);
        setCentres(response.data);
      } catch (error) {
        console.error('Error fetching centres:', error);
      }
    };

    fetchCentres();
  }, []);

  const handleOpen = () => {
    setOpenAddDogModal(true);
  };

  const handleClose = () => {
    setOpenAddDogModal(false);
  };

  if (dogs.length === 0) {
    return (
      <div className="Dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const handleNewDog = async () => {
    const imgUploadConfig = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    const imgFormData = new FormData();
    imgFormData.append('image', file[0]);

    const imgUploadResponse = await axios.post(
      `${BASE_URL}/api/dog/upload-image`,
      imgFormData,
      imgUploadConfig
    );

    await axios
      .post(`${BASE_URL}/api/dog`, {
        name: dogName,
        breed: dogBreed,
        gender: dogGender,
        tag: 1,
        weight: [],
        dob: dogDOB,
        image: imgUploadResponse.headers['location'],
        centre: dogCentre,
      })
      .then((response) => navigate(`/weight-tracker/${response.data._id}`));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="Dashboard">
        <div>
          <button onClick={handleOpen}>Add</button>
        </div>
        <div className="dog-card-container">
          {dogs.map((dog) => (
            <Link to={`/weight-tracker/${dog._id}`} key={dog._id} className="dog-link">
              <div className="dog-card">
                <img className="dog-image" src={dogImage} alt="Dog" />
                <div className="dog-info">
                  <div className="dog-name">{dog.name}</div>
                  <div className="breed">{dog.breed}</div>
                  <div className="gender">{dog.gender}</div>
                </div>
                <div className="weight-info">
                  <div className="current-weight">{dog.weight} kg</div>
                  <div className="last-weighed">Last weighed:</div>
                  <div>last-weighed-date</div>
                  <div className="dob">Date of Birth:</div>
                  <div>{dog.dob}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Dialog open={openAddDogModal} close={handleClose} maxWidth="md">
          <DialogContent>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 'calc(0.5*100vw)',
                marginTop: '20px',
                gap: '20px',
              }}>
              <h2 style={{ textAlign: 'center', margin: 0 }}>Add a new dog</h2>
              <FileDropZone onFileChange={handleFileChange} />
              <StyledTextField
                type="text"
                label="Name"
                size="small"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                required
              />
              <StyledTextField
                type="text"
                label="Gender"
                size="small"
                value={dogGender}
                onChange={(e) => setDogGender(e.target.value)}
                required
              />
              <StyledTextField
                type="text"
                label="Breed"
                size="small"
                value={dogBreed}
                onChange={(e) => setDogBreed(e.target.value)}
                required
              />
              <DatePicker
                value={dogDOB}
                onChange={(newValue) => setDogDOB(newValue)}
                label="Date of birth"
                size="small"
              />
              <FormControl required fullWidth size="small">
                <InputLabel shrink id="centre-select-label">
                  Centre
                </InputLabel>
                <Select
                  id="centre-select"
                  labelId="centre-select-label"
                  label="centre"
                  onChange={(e) => setDogCentre(e.target.value)}
                  fullWidth
                  style={{ borderRadius: '12px' }}
                  native>
                  {centres.map((centre) => (
                    <option key={centre._id} value={centre.name}>
                      {centre.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <div style={{ display: 'flex', gap: '20px' }}>
                <button className="cancel-button" onClick={() => handleClose()}>
                  Cancel
                </button>
                <button className="add-button" onClick={() => handleNewDog()}>
                  Add
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
}

export default Dashboard;

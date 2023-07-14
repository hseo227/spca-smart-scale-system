import React, { useContext, useState, useEffect } from 'react';
import AuthenticationContext from '../../context/AuthenticationContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import styles from './SignUp.module.css';
import spcaLogo from '../../assets/spcaLogo.svg';
import { FormControl, InputLabel, Select, MenuItem, TextField, styled } from '@mui/material';
import authenticationDecoration from '../../assets/authenticationDecoration.svg';

const roles = ['Vet', 'Volunteer'];

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    padding: '0',
    fontSize: '15px',
    borderRadius: '12px',
  },
  width: '100%',
});

function Signup() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [centre, setCentre] = useState('');
  const [role, setRole] = useState('');
  const [centres, setCentres] = useState([]);
  // const [age, setAge] = useState('');
  const { signup } = useContext(AuthenticationContext);

  useEffect(() => {
    // Fetch centres from the endpoint
    const fetchCentres = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/centre/');
        setCentres(response.data);
      } catch (error) {
        console.error('Error fetching centres:', error);
      }
    };

    fetchCentres();
  }, []);

  const handleSignup = async () => {
    // Perform validation to check if all required fields are filled
    if (!email || !fullName || !password || !centre || !role) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
    }

    await signup(email, password, fullName, centre, role);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.title}>
          <img src={spcaLogo} alt="spca" draggable="false" />
          <h2 style={{ margin: '0' }}>Smart Scale</h2>
        </div>
        <div className={styles.contentContainer}>
          <h1 style={{ alignSelf: 'flex-start', margin: '8px 0 8px 0' }}>Create an Account</h1>
          <StyledTextField
            type="email"
            size="small"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <StyledTextField
            type="text"
            label="Full Name"
            size="small"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <StyledTextField
            type="password"
            label="Password"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormControl required fullWidth size="small">
            <InputLabel shrink id="centre-select-label">
              Centre
            </InputLabel>
            <Select
              id="centre-select"
              labelId="centre-select-label"
              label="centre"
              onChange={(e) => setCentre(e.target.value)}
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
          <FormControl required fullWidth size="small">
            <InputLabel shrink id="role-select-label">
              Role
            </InputLabel>
            <Select
              id="role-select"
              labelId="role-select-label"
              label="role"
              sx={{ borderRadius: '12px' }}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              native>
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </FormControl>
          <button onClick={() => handleSignup()} className={styles.signUpButton}>
            Sign Up
          </button>
          <ToastContainer />
        </div>
      </div>
      <img
        src={authenticationDecoration}
        className={styles.authenticationDecoration}
        draggable="false"
      />
    </div>
  );
}

export default Signup;

import React, { useContext, useState } from 'react';
import AuthenticationContext from '../../context/AuthenticationContext';
import { useNavigate } from 'react-router-dom';
import spcaLogo from '../../assets/spcaLogo.svg';
import authenticationDecoration from '../../assets/authenticationDecoration.svg';

import styles from './LoginPage.module.css';
import { TextField, styled } from '@mui/material';

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    padding: '0',
    fontSize: '15px',
    borderRadius: '12px',
  },
  width: '100%',
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthenticationContext);

  const handleLogin = async () => {
    await login(email, password);
    navigate('/');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.title}>
          <img src={spcaLogo} alt="spca" draggable="false" />
          <h2 style={{ margin: '0' }}>Smart Scale</h2>
        </div>
        <div className={styles.contentContainer}>
          <h1 style={{ alignSelf: 'flex-start', margin: '8px 0 8px 0' }}>Login</h1>
          <StyledTextField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            size="small"
          />
          <StyledTextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
          />
          <button className={styles.loginButton} onClick={() => handleLogin()}>
            Login
          </button>
          <p className={styles.or}>
            <span>Or</span>
          </p>
          <div className={styles.signUpContainer}>
            <b>Don't have an account?</b>
            <b className={styles.signUp} onClick={() => navigate('/signup')}>
              Sign up
            </b>
          </div>
        </div>
      </div>
      <img src={authenticationDecoration} className={styles.authenticationDecoration} />
    </div>
  );
}

export default LoginPage;

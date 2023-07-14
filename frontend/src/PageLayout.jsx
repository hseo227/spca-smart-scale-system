import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './PageLayout.module.css';
import spcaLogo from './assets/spcaLogo.svg';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { AppBar, Box } from '@mui/material';
import AuthenticationContext from './context/AuthenticationContext';

const navTabs = [
  { title: 'Dashboard', to: '/', isActive: ['/', '/weight-tracker'] },
  { title: 'Chat', to: '/chat', isActive: ['/chat'] },
  { title: 'Settings', to: '/settings', isActive: ['/settings'] },
];

function PageLayout() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthenticationContext);
  let path = window.location.pathname;

  if (path.includes('weight-tracker')) {
    path = '/' + path.split('/')[1];
  } else if (path.includes('chat')) {
    path = '/' + path.split('/')[1];
  }

  const setNavItemStyle = (isActive) => {
    const style = {
      cursor: 'pointer',
      height: 'calc(100% - 3px)',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `${isActive ? '3px solid #1378c6' : 'none'}`,
      fontWeight: 600,
    };
    return style;
  };

  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user]);

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{ bgcolor: 'white', flexDirection: 'row', boxShadow: 'none' }}
          className={styles.navBar}>
          <div className={styles.logo} onClick={() => navigate('/')}>
            <img src={spcaLogo} alt="spcaLogo" className={styles.logoImage} />
            <h1 className={styles.logoHeading}>Smart Scale</h1>
          </div>
          <div className={styles.navItems}>
            {navTabs.map((item, index) => {
              const isActive = item.isActive.some((value) => value === path);
              return (
                <div
                  key={index}
                  onClick={() => navigate(`${item.to}`)}
                  style={setNavItemStyle(isActive)}>
                  {item.title}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button className={styles.logout} onClick={() => logout()}>
              Logout
            </button>
          </div>
        </AppBar>
      </Box>
      <Outlet />
    </React.Fragment>
  );
}

export default PageLayout;

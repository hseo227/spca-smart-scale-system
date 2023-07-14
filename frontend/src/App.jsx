import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './page-components/authentication/LoginPage';
import Signup from './page-components/authentication/SignUp';
import Dashboard from './page-components/Dashboard';
import Settings from './page-components/Settings';
import WeightTracker from './page-components/WeightTracker';
import PageLayout from './PageLayout';
import io from 'socket.io-client';
import Chat from './page-components/chat/Chat';
import AuthenticationContextProvider from './context/AuthenticationContextProvider';

const socket = io('http://localhost:5001', { autoConnect: false });

function App() {
  return (
    <>
      <AuthenticationContextProvider>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<Signup />} />
          <Route path="/" element={<PageLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/chat" element={<Chat socket={socket} />} />
            <Route path="/chat/:id" element={<Chat socket={socket} />} />
            <Route path="/weight-tracker/:dogId" element={<WeightTracker />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthenticationContextProvider>
    </>
  );
}

export default App;

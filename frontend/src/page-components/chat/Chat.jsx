import React, { useContext, useEffect, useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatContainer from './ChatContainer';
import AuthenticationContext from '../../context/AuthenticationContext';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Chat({ socket }) {
  const [selectedChat, setSelectedChat] = useState('');
  const [chatExists, setChatExists] = useState(false); // set to false once all functionality is done
  const [newChat, setNewChat] = useState(false);
  const [previousRoom, setPreviousRoom] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const { user } = useContext(AuthenticationContext);
  const userEmail = user.email;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/user/email/${userEmail}`)
      .then((response) => setCurrentUser(response.data));
  }, []);

  useEffect(() => {
    socket.connect('http://localhost:5001');
  }, []);

  useEffect(() => {
    if (selectedChat) {
      setChatExists(true);
    }
  }, [selectedChat]);

  return (
    <div style={{ display: 'flex', height: 'calc(0.93*100vh)' }}>
      <ChatSidebar
        socket={socket}
        setSelectedChat={setSelectedChat}
        setNewChat={setNewChat}
        setPreviousRoom={setPreviousRoom}
        previousRoom={previousRoom}
        currentUser={currentUser}
      />
      {(chatExists || newChat) && (
        <ChatContainer
          socket={socket}
          newChat={newChat}
          setNewChat={setNewChat}
          setSelectedChat={setSelectedChat}
          setPreviousRoom={setPreviousRoom}
          previousRoom={previousRoom}
          userEmail={userEmail}
          user={currentUser}
        />
      )}
    </div>
  );
}

export default Chat;

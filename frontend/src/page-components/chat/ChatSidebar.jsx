import React, { useState, useContext, useEffect } from 'react';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import axios from 'axios';

import styles from './ChatSidebar.module.css';
import UserListItem from './UserListItem';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ChatSidebar(props) {
  const { socket, setSelectedChat, setNewChat, setPreviousRoom, previousRoom, currentUser } = props;
  const [userChats, setUserChats] = useState([]);

  // get the chats for a user
  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      axios
        .get(`${BASE_URL}/api/user/chats/${currentUser._id}`)
        .then((response) => setUserChats(response.data));
    }
  }, [currentUser]);

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.titleContainer}>
        <h3 className={styles.title}>Chats</h3>
        <AddRoundedIcon className={styles.addMessage} onClick={() => setNewChat(true)} />
      </div>
      {userChats.map((chat, index) => (
        <UserListItem
          key={index}
          socket={socket}
          chat={chat}
          setSelectedChat={setSelectedChat}
          setPreviousRoom={setPreviousRoom}
          previousRoom={previousRoom}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}

export default ChatSidebar;

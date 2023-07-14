import React, { useEffect, useState } from 'react';

import styles from './UserListItem.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UserListItem(props) {
  const { socket, chat, setSelectedChat, setPreviousRoom, previousRoom, currentUser } = props;
  const [chatRecipient, setChatRecipient] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [mostRecentMessage, setMostRecentMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const chatRecipient = chat.users.filter((user) => user !== currentUser._id);
    axios
      .get(`${BASE_URL}/api/user/${chatRecipient}`)
      .then((response) => setChatRecipient(response.data.name));
  }, []);

  useEffect(() => {
    const firstLetter = chatRecipient.substring(0, 1).toLowerCase();
    const charCode = firstLetter.charCodeAt(0);

    if (charCode >= 97 && charCode <= 104) {
      setBackgroundColor('#ffa500');
    } else if (charCode >= 105 && charCode <= 112) {
      setBackgroundColor('#CBC3E3');
    } else {
      setBackgroundColor('#A2D9C2');
    }
  }, [chatRecipient]);

  useEffect(() => {
    setMostRecentMessage(chat.messages.slice(-1)[0]?.message);
  }, []);

  const handleOpenChat = () => {
    // leave the previous room and join the current one
    socket.emit('leave_room', { room: previousRoom });
    socket.emit('join_room', { room: chat.roomId });
    setPreviousRoom(chat.roomId);

    // create the chat in the DB if it doesn't already exist
    setSelectedChat(chat.roomId); // the chat id
    navigate(`/chat/${chat.roomId}`);
  };

  return (
    <div className={styles.listItemContainer} onClick={() => handleOpenChat()}>
      <div
        style={{
          borderRadius: '50%',
          display: 'flex',
          backgroundColor: `${backgroundColor}`,
          width: '40px',
          height: '40px',
          marginRight: '16px',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <p style={{ margin: '0', color: 'white', fontWeight: '600' }}>
          {chatRecipient.substring(0, 1)}
        </p>
      </div>
      <div className={styles.detailsContainer}>
        <div>{chatRecipient}</div>
        <div className={styles.messageDetails}>{mostRecentMessage}</div>
      </div>
    </div>
  );
}

export default UserListItem;

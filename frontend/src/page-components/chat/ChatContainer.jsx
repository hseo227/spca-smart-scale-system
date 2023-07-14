import React, { useEffect, useState } from 'react';

import { TextField, styled } from '@mui/material';
import { v4 as uuid } from 'uuid';
import styles from './ChatContainer.module.css';
import peopleBackground from '../../assets/chat/peopleBackground.png';
import ChatMessage from './ChatMessage';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SearchResults from './SearchResults';

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    padding: '2px 8px',
    fontSize: '15px',
    backgroundColor: '#EEEEEE',
    borderRadius: '12px',
  },
  width: '100%',
  alignSelf: 'center',
});

const StyledSearchTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    fontSize: '16px',
  },
  width: '100%',
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ChatContainer(props) {
  const {
    socket,
    newChat,
    setNewChat,
    setSelectedChat,
    previousRoom,
    setPreviousRoom,
    userEmail,
    user,
  } = props;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // set previous messages
  useEffect(() => {
    axios.get(`${BASE_URL}/api/chat/all-messages/${id}`).then((response) => {
      response.data?.messages.length > 0 && setMessages(response.data.messages);
    });
  }, [id]);

  const handleSetRecipientEmail = async () => {
    const chat = await axios.get(`${BASE_URL}/api/chat/${id}`);
    const chatRecipient = chat.data.users.filter((chatUser) => chatUser !== user._id);
    await axios
      .get(`${BASE_URL}/api/user/${chatRecipient}`)
      .then((response) => setRecipientEmail(response.data.email));
  };

  useEffect(() => {
    if (messages.length > 0) {
      handleSetRecipientEmail();
    }
  }, [messages]);

  // continously set the live messages received
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((messages) => [
        ...messages,
        {
          id: data.id,
          username: data.username,
          userId: data.userId,
          message: data.message,
        },
      ]);
    });
  }, [socket]);

  // search every time the search term changes
  useEffect(() => {
    if (searchTerm !== '') {
      axios
        .get(`${BASE_URL}/api/user/search/${searchTerm}/${userEmail}`)
        .then((response) => setSearchResults(response.data));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSendMessage = async () => {
    const messageId = uuid();
    // if its the first message in the room, then create a list item for the side bar
    if (message !== '') {
      socket.emit('send_message', {
        id: messageId,
        room: id,
        message,
        username: `${user.name}`,
        userId: `${user._id}`,
        recipientEmail: recipientEmail,
      });

      // save to db
      await axios.put(`${BASE_URL}/api/chat/new-message/${id}`, {
        id: messageId,
        username: `${user.name}`,
        userId: `${user._id}`,
        message: message,
      });
      setMessage('');
    }
  };

  const handleNewChat = async (recipient) => {
    const roomId = uuid();
    setNewChat(false);
    setSelectedChat(roomId);
    // leave the past room and join the new one
    socket.emit('leave_room', { room: previousRoom });
    socket.emit('join_room', { room: roomId });
    setPreviousRoom(roomId);

    navigate(`/chat/${roomId}`);
    await axios.post(`${BASE_URL}/api/chat/${roomId}`, { users: [user._id, recipient] });
    await axios.put(`${BASE_URL}/api/user/chats/${user._id}`, { newChat: roomId });
    await axios.put(`${BASE_URL}/api/user/chats/${recipient}`, { newChat: roomId });
  };

  console.log(searchResults);

  return (
    <div style={{ height: '100%', width: 'calc(0.7*100vw)' }}>
      {newChat ? (
        // New Chat
        <>
          <div
            style={{
              borderBottom: '2px solid #EEEEEE',
              height: 'calc(0.05*100%)',
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
            }}>
            <p style={{ margin: '0', color: '#808080', marginRight: '8px' }}>To: </p>
            <StyledSearchTextField
              id="search"
              type="search"
              variant="standard"
              fullWidth
              autoFocus
              autoComplete="off"
              onChange={(event) => setSearchTerm(event.target.value)}
              InputProps={{ disableUnderline: true }}
            />
          </div>
          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map((user) => (
                <SearchResults
                  key={user._id}
                  user={user}
                  handleNewChat={(recipient) => handleNewChat(recipient)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateRows: '7fr 1fr',
            height: '100%',
          }}>
          {/* Message Container */}
          <div
            style={{
              backgroundImage: `url(${peopleBackground})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom right',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'overflow',
            }}>
            {/* Messages */}
            {messages.length > 0 &&
              messages.map((message) => (
                <ChatMessage message={message} key={message.id} user={user} />
              ))}
          </div>
          {/* Input Container */}
          <div className={styles.chatInput}>
            <StyledTextField
              variant="standard"
              placeholder="Message..."
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSendMessage();
                }
              }}
              InputProps={{
                disableUnderline: true,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatContainer;

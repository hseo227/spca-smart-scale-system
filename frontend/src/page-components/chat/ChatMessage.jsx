import React from 'react';

import styles from './ChatMessage.module.css';

function ChatMessage({ message, user }) {
  const isCurrentUser = message.userId === user._id;

  console.log(message);

  return (
    // Message Container
    <div
      style={{
        display: 'flex',
        alignSelf: `${isCurrentUser ? 'flex-end' : 'flex-start'}`,
        marginBottom: '16px',
        maxWidth: '100%',
      }}>
      {/* Message Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: `${isCurrentUser ? 'flex-end' : 'flex-start'}`,
        }}>
        <h4 className={styles.username}>{message.username}</h4>
        <div
          style={{
            backgroundColor: `${isCurrentUser ? '#B8E2F2' : '#D9D9D9'}`,
            display: 'flex',
            padding: '8px',
            borderRadius: '16px',
            width: 'fit-content',
          }}>
          {message.message}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;

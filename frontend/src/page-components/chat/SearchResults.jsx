import React from 'react';
import styles from './ChatContainer.module.css';

function SearchResults({ user, handleNewChat }) {
  var backgroundColor = '';
  const firstLetter = user.name.substring(0, 1).toLowerCase();
  const charCode = firstLetter.charCodeAt(0);

  if (charCode >= 97 && charCode <= 104) {
    backgroundColor = '#ffa500';
  } else if (charCode >= 105 && charCode <= 112) {
    backgroundColor = '#CBC3E3';
  } else {
    backgroundColor = '#A2D9C2';
  }

  return (
    <div className={styles.searchResultItem} onClick={() => handleNewChat(user._id)}>
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
        <p style={{ margin: '0', color: 'white', fontWeight: '600' }}>V</p>
      </div>
      <p style={{ margin: '0' }}>{user.name}</p>
    </div>
  );
}

export default SearchResults;

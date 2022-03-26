import React, { useEffect } from 'react';
import './style.css';
import { getWords } from './utils';
const levels = ['easy', 'medium', 'hard'];
const Words = ({ history, socket }) => {
  const wordsData = levels.map((level) => {
    return {
      level,
      words: getWords(3, level),
      levelScore: level === 'easy' ? 1 : level === 'medium' ? 3 : 5
    };
  });

  const roomId = localStorage.getItem('roomId');
  return (
    <div className="container-words">
      <h2 style={{ color: '#6225e6', textTransform: 'uppercase' }}>
        Select A word!
      </h2>

      {wordsData.map(({ level, words, levelScore }, index) => {
        return (
          <div
            style={{ flexGrow: 0, flexShrink: 1, flexBasis: 'auto' }}
            key={`level-${index}`}
          >
            <div
              className="level-header"
              style={{
                backgroundColor: '#6225e6',
                textAlign: 'center',
                fontSize: 16,
                color: '#fafafa',
                height: 36,
                fontWeight: '700',
                textTransform: 'uppercase',
                lineHeight: 2
              }}
            >
              <p>{level}</p>
            </div>
            <div
              style={{
                border: '3px solid #6225e6',
                padding: 8
              }}
              key={index}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  flexWrap: 'wrap'
                }}
              >
                {words.map((word, index) => {
                  return (
                    <button
                      key={index}
                      className="custom-btn"
                      style={{ margin: 8 }}
                      onClick={() => {
                        socket &&
                          socket.emit('select-word', {
                            roomId,
                            word,
                            level: levelScore
                          });
                        history.push('/draw');
                      }}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* 

      {words.map((word, index) => (
        <button
        key={index}
        className="custom-btn"
        style={{ margin: 16, width: '70%' }}
        onClick={() => {
          socket && socket.emit('select-word', { roomId, word, level });
          history.push('/draw');
        }}
      >
        {word}
      </button>
      ))} */}
    </div>
  );
};

export default Words;

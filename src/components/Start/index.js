import './style.css';
import Welcome from '../Animations/Welcome';
import Button from '../Button';
import { useState, useEffect } from 'react';

const Start = ({ history, socket }) => {
  const roomId = localStorage.getItem('roomId');
  const [bestScore, setBestScore] = useState(null);
  const fetchBestScore = async () => {
    const res = await fetch('/best-score');
    const json = await res.json();
    if (res.status === 200) setBestScore(json.bestScore);
  };
  useEffect(() => {
    fetchBestScore();
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <h1 style={{ color: '#6225e6' }}>
        {!bestScore && bestScore !== 0
          ? 'Loading best Score....'
          : `Best Score : ${bestScore}`}
      </h1>
      <div style={{ marginBottom: 32 }}>
        <Welcome />
      </div>
      <Button
        onStart={() => {
          socket.emit('room-create', { roomId });
          history.push('/waiting');
        }}
      />
    </div>
  );
};

export default Start;

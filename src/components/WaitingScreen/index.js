import { useEffect, useState } from 'react';
import Waiting from '../Animations/Waiting';
import CopyToClipboard from 'react-copy-to-clipboard';
const WaitingScreen = ({ history, socket }) => {
  const roomId = localStorage.getItem('roomId');
  const roomLink = `http://draw-guessing-app.herokuapp.com/draw?roomId=${roomId}`;

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('joined', (data) => {
        const { roomId: serverRoom } = data;
        if (roomId !== serverRoom) return;
        history.push('/word');
      });
    }
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Waiting />
      <h4 style={{ color: '#6225e6', fontSize: 24, fontWeight: 700 }}>
        Waiting for people to join...
      </h4>

      <CopyToClipboard text={roomLink} onCopy={() => setCopied(true)}>
        <button className="custom-btn-2" style={{ width: '100%' }}>
          {copied ? 'Link copied!' : 'Copy room link!'}
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default WaitingScreen;

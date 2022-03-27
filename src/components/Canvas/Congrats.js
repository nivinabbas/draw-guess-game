import Celebrate from '../Animations/Celebrate';
import './style.css';
const Congrats = ({ socket, history, roomId, score }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: -100,
        left: -10,
        right: -10,
        bottom: -10,
        zIndex: 10,
        backdropFilter: `blur(8px)`,
      }}
    >
      <div className="celebrate" id="celebrate">
        <h1 style={{ color: '#6225e6' }}>Score: {score} </h1>
        <div style={{ height: 200 }}>
          <Celebrate />
        </div>
        <h1 style={{ color: '#6225e6' }}>Well Done!!!! 🎉 </h1>
        <h4 style={{ color: '#6225e6' }}> Its your turn now</h4>
        <button
          className="custom-btn-2"
          style={{ width: '100%' }}
          onClick={() => {
            socket.emit('set-active-player', {
              roomId,
              activePlayer: socket.id,
            });
            history.push('/word');
          }}
        >
          Start!
        </button>
      </div>
    </div>
  );
};

export default Congrats;

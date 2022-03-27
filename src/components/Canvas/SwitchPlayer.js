import Celebrate from '../Animations/Celebrate';
import './style.css';
const SwitchPlayer = ({ score }) => {
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
        <h1 style={{ color: '#6225e6' }}>Let's Switch!!!! 🎉 </h1>
        <h4 style={{ color: '#6225e6' }}> Your friend guessed it!</h4>
      </div>
    </div>
  );
};

export default SwitchPlayer;

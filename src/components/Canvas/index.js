import { useState, useEffect, useRef, useCallback } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import qs from 'qs';
import './style.css';
import debounce from 'lodash.debounce';
import Congrats from './Congrats';
import SwitchPlayer from './SwitchPlayer';

const Canvas = ({ socket, location, history }) => {
  const [disabled, setDisabled] = useState(false);
  const [word, setWord] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [success, setSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [switchPlayer, setSwitchPlayer] = useState(false);
  const ref = useRef(null);
  const chatBoxRef = useRef(null);
  const roomId = localStorage.getItem('roomId');
  const paramRoomId = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  }).roomId;

  useEffect(() => {
    if (socket) {
      if (paramRoomId) {
        socket.emit('join-room', { roomId: paramRoomId });
      }
      socket.on('drawing', async ({ drawings, option }) => {
        if (drawings && ref && ref.current) {
          if (option === 'clear') {
            await ref.current.resetCanvas();
            return ref.current.clearCanvas();
          }
          await ref.current.clearCanvas();
          return ref.current.loadPaths(drawings);
        }
      });
      socket.on('chatting', (data) => {
        const { messages = [], roomId: serverRoomId } = data;
        if (
          messages.length &&
          (serverRoomId === paramRoomId || roomId === serverRoomId)
        ) {
          setMessages(messages);
          if (chatBoxRef && chatBoxRef.current)
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      });

      socket.on('success', (data) => {
        const { player, score } = data;

        if (player !== socket.id) {
          setSwitchPlayer(true);
        } else {
          setSuccess(true);
          setSwitchPlayer(false);
        }
        setScore(score || 0);
      });
      socket.on('active', (activePlayer) => {
        if (activePlayer === socket.id) setDisabled(false);
        else {
          setDisabled(true);
          setSwitchPlayer(false);
        }
      });

      socket.emit('check-active-player', { roomId: paramRoomId || roomId });
    }
  }, []);

  const sendDrawings = (paths = [], option) => {
    socket.emit('draw', {
      drawings: paths,
      roomId: paramRoomId || roomId,
      option,
    });
  };
  const debounceDrawSend = useCallback(
    debounce(async () => {
      if (ref && ref.current) {
        const paths = await ref.current.exportPaths();
        sendDrawings(paths, 'draw');
      }
    }, 300),
    []
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 60,
        paddingBottom: 16,
      }}
    >
      {success && (
        <Congrats
          socket={socket}
          score={score}
          history={history}
          roomId={paramRoomId || roomId}
        />
      )}

      {switchPlayer && <SwitchPlayer score={score} />}
      {!disabled && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: 16,
          }}
        >
          <button
            className="custom-btn-2"
            onClick={() => {
              if (ref && ref.current) {
                ref.current.clearCanvas();
                sendDrawings([], 'clear');
              }
            }}
          >
            Delete
          </button>
          <button
            className="custom-btn-2"
            onClick={async () => {
              if (ref) {
                await ref.current.undo();
                const pathsAfter = await ref.current.exportPaths();
                sendDrawings(pathsAfter, 'undo');
              }
            }}
          >
            UNDO
          </button>
        </div>
      )}
      <div
        style={{
          width: '100%',
          border: 'solid 3px #6225e6',
        }}
      >
        <ReactSketchCanvas
          ref={ref}
          onChange={() => debounceDrawSend('draw')}
          style={{ width: '100%', height: '300px' }}
          strokeWidth={10}
          strokeColor="#fbc638"
          allowOnlyPointerType={`${disabled ? 'pen' : 'all'}`}
        />
      </div>
      {disabled && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: -3,
            width: '100%',
          }}
        >
          <input
            type="text"
            style={{
              border: 'solid 3px #6225e6',
              height: 48,
              fontSize: 16,
              outline: 'none',
              padding: 8,
              marginLeft: -3,
              borderRight: 0,
              borderRadius: 0,
            }}
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder={`Guess?`}
            maxLength="11"
          />
          <button
            className="custom-btn-2"
            style={{ marginLeft: -1, marginRight: -3 }}
            onClick={() => {
              socket.emit('guess-word', {
                word,
                roomId: paramRoomId ? paramRoomId : roomId,
              });
              setWord('');
            }}
          >
            Guess
          </button>
        </div>
      )}
      <div
        style={{
          marginTop: 16,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          ref={chatBoxRef}
          style={{
            width: '100%',
            border: 'solid 3px #6225e6',
            height: 100,
            overflow: 'auto',
          }}
        >
          {messages.map(({ msg, sender }, index) => {
            const float = `${socket.id === sender ? 'right' : 'left'}`;
            return (
              <div
                key={`chat-${index}`}
                style={{
                  width: '100%',
                  float,
                }}
              >
                <div
                  key={index}
                  style={{
                    float,
                    width: 100,
                    backgroundColor: `${
                      socket.id === sender ? '#6225e6' : '#fbc638'
                    }`,
                    color: '#fafafa',
                    margin: 8,
                    padding: 4,
                  }}
                >
                  {msg}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: -3,
            width: '100%',
          }}
        >
          <input
            type="text"
            style={{
              border: 'solid 3px #6225e6',
              height: 48,
              fontSize: 16,
              outline: 'none',
              padding: 8,
              marginLeft: -3,
              borderRight: 0,
              borderRadius: 0,
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Send`}
            maxLength="11"
          />
          <button
            className="custom-btn-2"
            style={{ marginLeft: -1, marginRight: -3 }}
            onClick={() => {
              if (message === '') return;
              socket.emit('message-chat', {
                msg: message,
                roomId: paramRoomId ? paramRoomId : roomId,
              });
              setMessage('');
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;

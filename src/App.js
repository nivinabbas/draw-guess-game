import React, { useEffect } from 'react';

import './App.css';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import Start from './components/Start';
import Words from './components/Words';
import { useState } from 'react';
import Canvas from './components/Canvas';
import { v4 as uuidv4 } from 'uuid';
import WaitingScreen from './components/WaitingScreen';
import qs from 'qs';

function App({ history }) {
  window.onunload = function () {
    localStorage.removeItem('roomId');
  };

  const paramRoomId = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  }).roomId;

  if (!localStorage.getItem('roomId')) {
    if (paramRoomId) {
      localStorage.setItem('roomId', paramRoomId);
    } else {
      localStorage.setItem('roomId', uuidv4());
    }
  }

  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    return () => socket.disconnect();
  }, []);
  return (
    <div
      style={{
        maxWidth: 400,
        minWidth: 350,
        height: '100%',

        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Switch>
        <Route
          exact
          path="/"
          component={(props) => <Start socket={socket} {...props} />}
        />
        <Route
          path="/waiting"
          component={(props) => <WaitingScreen socket={socket} {...props} />}
        />

        <Route
          path="/word"
          component={(props) => <Words socket={socket} {...props} />}
        />
        <Route
          path="/draw"
          component={(props) => <Canvas socket={socket} {...props} />}
        />
      </Switch>
    </div>
  );
}

export default App;

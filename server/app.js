import express from 'express';
import httpServer from 'http';
import socketIO from 'socket.io';
import cors from 'cors';
import { createRoom, getBestScore, getRoom, updateRoom } from './db/services';
import path from 'path';
require('./db');

const app = express();
app.use(express.static(__dirname));
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

const server = httpServer.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (client) => {
  client.on('room-create', async (data) => {
    const { roomId } = data;
    await createRoom(roomId, client.id);
    console.log('room created', roomId);
  });

  client.on('join-room', async (data) => {
    const { roomId } = data;
    if (!roomId) return;
    const room = await getRoom({ roomId });
    if (!room) return;
    const { players } = room;
    if (players.length === 1) {
      const updateSchema = { players: [...players, client.id] };
      client.broadcast.to(players[0]).emit('joined', { roomId });
      await updateRoom(roomId, updateSchema);
    }
  });

  client.on('check-active-player', async (data) => {
    const { roomId } = data;
    if (!roomId) return;
    const room = await getRoom({ roomId });
    if (!room) return;
    const activePlayer = room.activePlayer;
    client.emit('active', activePlayer);
  });

  client.on('select-word', async (data) => {
    const { roomId, word, level } = data;
    if (!roomId || !word || word === '') return;
    const room = await getRoom({ roomId });
    if (!room) return;
    const updateSchema = { words: [...room.words, { word, level }] };
    await updateRoom(roomId, updateSchema);
  });

  client.on('message-chat', async (data) => {
    const { roomId, msg } = data;
    if (!roomId) return;
    const room = await getRoom({ roomId });
    if (!room) return;
    const newMessages = [...room.messages, { sender: client.id, msg }];
    io.emit('chatting', { roomId, messages: newMessages });
    const updateSchema = {
      messages: newMessages,
    };
    await updateRoom(roomId, updateSchema);
  });

  client.on('guess-word', async (data) => {
    const { roomId, word } = data;
    if (!roomId || !word || word === '') return;
    const room = await getRoom({ roomId });
    if (!room) return;
    const words = room.words;
    if (words.length) {
      const currentWord = words[words.length - 1];
      if (currentWord.word.toLowerCase() === word.toLowerCase()) {
        const newScore = room.score + currentWord.level;
        const [otherPlayer] = room.players.filter((p) => p !== client.id);
        client.emit('success', {
          score: newScore,
          player: client.id,
        });
        client.broadcast
          .to(otherPlayer)
          .emit('success', { player: client.id, score: newScore });
        await updateRoom(roomId, { score: newScore });
      }
    }
  });

  client.on('draw', async (data) => {
    const { roomId, drawings, option } = data;
    if (!roomId) return;
    const room = await getRoom({ roomId });
    if (!room) return;
    const [player] = room.players.filter((p) => p !== client.id);
    if (player !== room.activePlayer)
      client.broadcast.to(player).emit('drawing', { drawings, option });
  });

  client.on('set-active-player', async (data) => {
    const { roomId, activePlayer } = data;
    if (!roomId) return;
    const room = await getRoom({ roomId });
    if (!room) return;
    const oldActivePlayer = room.activePlayer;
    client.broadcast.to(oldActivePlayer).emit('active', activePlayer);
    client.broadcast
      .to(oldActivePlayer)
      .emit('drawing', { drawings: [], option: 'clear' });
    await updateRoom(roomId, { activePlayer: activePlayer });
  });
});

app.get('/best-score', cors(), async (req, res) => {
  try {
    const bestScore = await getBestScore();
    if (!bestScore) return res.status(200).json({ bestScore: 0 });
    return res.status(200).json({ bestScore });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

server.listen(process.env.PORT || 5000, () => {
  console.log('server up on 5000');
});

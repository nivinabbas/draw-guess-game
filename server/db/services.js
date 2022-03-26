import Room from '../models/room';

export const cache = {};

export const createRoom = async (roomId, clientId) => {
  const newRoom = {
    roomId,
    players: [clientId],
    activePlayer: clientId,
    messages: [],
    words: [],
    score: 0,
    playTime: 0
  };
  cache[roomId] = newRoom;
  try {
    await new Room(newRoom).save();
  } catch (err) {
    console.log(err.message);
  }
  return;
};

export const getRoom = async (filter) => {
  if (!Object.keys(filter)) return;
  let room;
  if (filter.roomId) {
    room = cache[filter.roomId];
    if (room) return room;
  }

  try {
    room = await Room.findOne(filter).lean();
  } catch (err) {
    console.log(err.message);
  }
  if (!room) return;
  return room;
};

export const updateRoom = async (roomId, updateSchema) => {
  if (!roomId) return;
  cache[roomId] = { ...cache[roomId], ...updateSchema };
  try {
    await Room.updateOne({ roomId }, updateSchema);
  } catch (err) {
    console.log(err.message);
  }
};

export const getBestScore = async () => {
  const rooms = await Room.find().sort({ score: -1 }).lean();
  if (!rooms || !rooms.length) return;
  return rooms[0].score;
};

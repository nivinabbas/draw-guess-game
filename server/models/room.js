import mongoose from 'mongoose';

const RoomSchema = mongoose.Schema(
  {
    roomId: String,
    players: [String],
    activePlayer: String,
    messages: [{ sender: String, msg: String }],
    words: [{ word: String, level: Number }],
    score: Number,
    playTime: Number
  },
  {
    timestamps: true
  }
);

const Room = mongoose.model('Room', RoomSchema, 'Rooms');

export default Room;

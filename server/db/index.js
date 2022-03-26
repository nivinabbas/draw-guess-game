import mongoose from 'mongoose';

const { MONGO_DB_URI } = process.env;
const dbServerOptions = {
  useNewUrlParser: true,
  keepAlive: 1,
  useUnifiedTopology: true
};

mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('connecting', () => {
  process.stdout.write('DB connecting \n');
});
db.on('error', (error) => {
  process.stdout.write(`Error loading the db - ${error} \n`);
});
db.once('open', () => {
  process.stdout.write('DB Opened \n');
});
db.once('connected', () => {
  process.stdout.write('DB Connected \n');
});
db.on('reconnected', () => {
  process.stdout.write('DB Reconnected \n');
});
db.on('disconnected', () => {
  process.stdout.write('disconnected \n');
  mongoose.connect(MONGO_DB_URI, dbServerOptions);
});
mongoose.connect(MONGO_DB_URI, dbServerOptions);

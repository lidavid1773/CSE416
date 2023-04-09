const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const userRoutes = require('./routes/user-routes');
const commentRoutes = require('./routes/comment-routes');
const mapRoutes = require('./routes/map-routes');

const app = express();
app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
                  secret: 'sk',
                  cookie: {},
                  resave: false,
                  saveUninitialized: true, 
                  store: MongoStore.create({
                  mongoUrl: process.env.MONGODB_URI,
}) }));

//  connect MongoDB
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDb!");

  } catch (err) {
    console.error(err);
  }

  const PORT = process.env.PORT || 8000; 
  app.listen(PORT, () => {
    console.log("Listening on port " + `${PORT}` + " !!!");
  });
};

start();

app.use(userRoutes);
app.use(commentRoutes);
app.use(mapRoutes);


app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const db = mongoose.connection;

db.on('error', function (err) {
  console.error(err);
});

process.on('SIGINT', async () => {
  await db.close();
  console.info('Server closed. Database instance disconnected');
  process.exit(0);
});


module.exports = app;

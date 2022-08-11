import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import profileRoute from './routes/profile.route.js';
import isAuth from './middlewares/is-auth.middleware.js';
import logger from './middlewares/logger.middleware.js';

const app = express();
const port = 3000;

dotenv.config();

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(logger);

// temporary just for test isAuth middleware
app.get('/', isAuth, (req, res) => {
  res.json({
    userData: req.userData,
    message: 'it works'
  });
});

app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/profile', profileRoute);

// 404
app.use((req, res, next) => {
  res.sendStatus(404);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/users3');

  app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
};

main();

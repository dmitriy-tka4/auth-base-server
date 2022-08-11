import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { generateToken } from '../utils/generate-token.util.js';

// signup

const signup = async (req, res, next) => {
  console.log(req.body);

  if (!req.body) {
    return res.status(400).send('Отсутствует тело запроса');
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Отсутствует email или password');
  }

  // проверка на существование уже такого пользователя by email
  // это можно делать на уровне базы, в модели у поля есть свойство unique: true,
  const isEmailExisted = await User.exists({ email });

  if (isEmailExisted) {
    return res.status(400).send('Пользователь с таким email уже существует');
  }

  // check password - must be min 6 symbols
  if (password.length < 6) {
    return res.status(400).send('Пароль должен быть не менее 6 символов');
  }

  // ok - создаем пользователя
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword
  });

  try {
    await user.save();

    // jwt
    const payload = {
      userId: user._id
    };

    const token = await generateToken(payload, process.env.JWT_SECRET);

    // add jwt to cookies
    res.cookie('access_token', token); // , { httpOnly: true, secure: true }

    res.status(201).json({
      token
    });
  } catch (e) {
    console.log(e);
    res.status(400).send('Ошибка сохранения в базу');
  }
};

// login

const login = async (req, res, next) => {
  console.log(req.body);

  if (!req.body) {
    return res.status(400).send('Отсутствует тело запроса');
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Отсутствует email или password');
  }

  // find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send('Пользователь с таким email не найден');
  }

  // проверить пароль
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).send('Пароль неверный');
  }

  // jwt
  const payload = {
    userId: user._id
  };

  const token = await generateToken(payload, process.env.JWT_SECRET);

  // add jwt to cookies
  res.cookie('access_token', token); // , { httpOnly: true, secure: true }

  res.status(201).json({
    token
  });
};

// logout

const logout = async (req, res, next) => {
  // удалить cookie
  res.clearCookie('access_token'); // , { httpOnly: true, secure: true }

  res.sendStatus(204);
};

export { login, signup, logout };

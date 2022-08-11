import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
  // // check availability access token

  // headers

  // const authHeader = req.get('Authorization');

  // if (!authHeader) {
  //   return res.status(401).send('Отсутствует authorization header');
  // }

  // const token = authHeader && authHeader.split(' ')[0] === 'Bearer' && authHeader.split(' ')[1];


  // cookies

  if (!req.cookies || req.cookies && !req.cookies['access_token']) {
    return res.status(401).send('Has no cookie');
  }

  const token = req.cookies['access_token'];

  if (!token) {
    return res.status(401).send('Токен не передан');
  }

  // verify jwt
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // add userData to request
    req.userData = decodedPayload;

    next();
  } catch (e) {
    res.status(401).send('Токен недействительный');
  }
};

export default isAuth;

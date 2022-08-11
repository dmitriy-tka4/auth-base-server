import jwt from 'jsonwebtoken';

const generateToken = async (payload, secret) => {
  const token = jwt.sign(payload, secret, { expiresIn: '1800s' }); // 30 minutes

  return token;
};

export { generateToken };

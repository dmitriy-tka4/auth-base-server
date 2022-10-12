import User from '../models/user.model.js';

const getUserInfo = async (req, res, next) => {
  const userData = req.userData;

  if (!userData) {
    return res.status(401).send('Отсутствует userData');
  }

  const id = userData.userId;

  try {
    // exclude password
    const user = await User.findById(id, ['-password']);

    res.json(user);
  } catch (e) {
    next(e);
  }
};

export { getUserInfo };

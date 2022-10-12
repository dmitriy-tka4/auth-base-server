import { Router } from 'express' ;
import * as authController from '../controllers/auth.controller.js';
import isAuth from '../middlewares/is-auth.middleware.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.delete('/logout', authController.logout); // не защищаем роут, удаляем токен из куки в любом случае

// TODO:
// '/remove' - удаление пользователя // secure route

export default router;

import express from 'express';
import { Authenticate } from '../Middlewares/Authenticate.js';
import { AllUsers, Dashboard, login, register } from '../Controllers/UserController.js';

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/admin-home',Authenticate,Dashboard);
router.get('/all-users',Authenticate,AllUsers);



export default router;
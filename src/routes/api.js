import express from 'express';
import userRouter from './user.js';
import teamRouter from './team.router.js';

const router = express.Router();

router.use('/user', userRouter);
router.use('/team', teamRouter);

export default router;

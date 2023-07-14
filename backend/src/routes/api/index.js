import express from 'express';

const router = express.Router();

import dogRoutes from './dog';
import userRoutes from './user';
import centreRoutes from './centre';
import scaleRoutes from './scale';
import chatRoutes from './chat';

router.use('/dog', dogRoutes);
router.use('/user', userRoutes);
router.use('/centre', centreRoutes);
router.use('/scale', scaleRoutes);
router.use('/chat', chatRoutes);

export default router;

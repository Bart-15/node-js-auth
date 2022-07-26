import express from 'express';
import { handleRefreshToken } from '../../controllers/refreshTokenController.js';
const router = express.Router();


// @route    /login
// @desc     create new user
// @access   Public
router.get('/refresh', handleRefreshToken);

export default router;
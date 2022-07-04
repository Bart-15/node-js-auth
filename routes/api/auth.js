import express from 'express';
import { login } from '../../controllers/authController.js';
const router = express.Router();

// @route    /login
// @desc     create new user
// @access   Public
router.post('/login', login);

export default router;

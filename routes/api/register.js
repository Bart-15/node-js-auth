import express from 'express';
import { newUser } from '../../controllers/registerController.js';
const router = express.Router();

// @route    /register
// @desc     create new user
// @access   Public
router.post('/register', newUser);


export default router;
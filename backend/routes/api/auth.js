import express from 'express';
import { login } from '../../controllers/authController.js';
const router = express.Router();
import verifyJwt from '../../middleware/verifyJwt.js'

// @route    /login
// @desc     create new user
// @access   Public
router.post('/login', login);




export default router;

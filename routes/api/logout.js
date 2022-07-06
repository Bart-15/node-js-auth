import express from 'express';
import  handleLogout  from '../../controllers/logoutController.js';
const router = express.Router();


// @route    /logout
// @desc     create new user
// @access   Public
router.get('/logout', handleLogout);

export default router;
import express from 'express';
const router = express.Router();
import {resetPasswordEmail, resetPassword} from '../../controllers/resetPasswordController.js';

// @route    /reset
// @desc     generate token to reset password
// @access   Public
router.post('/reset', resetPasswordEmail);

// @route    /reset
// @desc     reset password now
// @access   Public
router.post('/reset-password/:userId/:token', resetPassword)

export default router;
import express from 'express';
import verifyJwt from '../../middleware/verifyJwt.js'
import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES_LIST from '../../config/roles_lists.js';
import {getUser, getUsers, getUserData, updateRoles} from '../../controllers/userController.js'
const router = express.Router();

// @route    /user
// @desc     get user info
// @access   Private
router.get('/user', verifyJwt, verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor), getUser);

// @route    /user
// @desc     get user info
// @access   Private
router.get('/users', verifyJwt, verifyRoles(ROLES_LIST.Admin), getUsers);

// @route    /user
// @desc     get user info
// @access   Private
router.get('/user/:id', verifyJwt, verifyRoles(ROLES_LIST.Admin), getUserData);


// @route    /user/:id
// @desc     uodate user roles
// @access   Private
router.patch('/user/:id', verifyJwt, verifyRoles(ROLES_LIST.Admin), updateRoles);




export default router;
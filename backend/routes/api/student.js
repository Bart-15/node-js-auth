import express from 'express';
import { newStudent, getStudents, deleteStudent, getStudent, updateStudent } from '../../controllers/studentController.js';
import verifyJwt from '../../middleware/verifyJwt.js'
import verifyRoles from '../../middleware/verifyRoles.js';
import ROLES_LIST from '../../config/roles_lists.js';
const router = express.Router();

// @route    /students
// @desc     create new student
// @access   Private
router.post('/students', verifyJwt, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), newStudent);

// @route    /students
// @desc     get all students
// @access   Private
router.get('/students', verifyJwt, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), getStudents);

// @route    /students
// @desc     delete student
// @access   Private
router.delete('/students/:id', verifyJwt, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), deleteStudent);

// @route    /students
// @desc     get student by ID
// @access   Private
router.get('/student/:id', verifyJwt, verifyRoles(ROLES_LIST.User), getStudent);


// @route    /students
// @desc     get student by ID
// @access   Private
router.patch('/student/:id', verifyJwt, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), updateStudent);


export default router;
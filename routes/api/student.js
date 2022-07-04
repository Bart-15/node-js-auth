import express from 'express';
import { newStudent, getStudents } from '../../controllers/studentController.js';
import verifyJwt from '../../middleware/verifyJwt.js'
const router = express.Router();


// @route    /students
// @desc     create new student
// @access   Private
router.post('/students', newStudent);

// @route    /students
// @desc     get all students
// @access   Private
router.get('/students', verifyJwt, getStudents);


export default router;
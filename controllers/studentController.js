import Student from '../models/Student.js';
import {validateStudentInput} from '../validation/studentInputValidation.js';

export const newStudent = async (req, res) => {
    const  {errors, isValid} = validateStudentInput(req.body);
    if(!isValid) return res.status(400).json(errors);
    
    try {
        await new Student({
            name:req.body.name,
            lastName:req.body.lastName
        }).save();

        res.status(200).json({message: 'Student created successfully!'});
    }catch(err) {
        res.status(500).json(err.message);
    }
}

export const getStudents = async (req, res) => {
    try {
       const student =  await Student.find({});
       res.status(200).json({student, name:req.name});
    }catch(err) {
        res.status(500).json(err.message);
    }
}
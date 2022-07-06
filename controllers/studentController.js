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

       return res.status(200).json({message: 'Student created successfully!'});
    }catch(e) {
        res.status(500).json(e.message);
    }
}

export const getStudents = async (req, res) => {
    try {
       const student =  await Student.find({});
      
       res.status(200).json({student, name:req.name});
    }catch(e) {
        res.status(500).json(e.message);
    }
}

export const deleteStudent = async (req, res) => {
    try {   
        const _id = req.params.id;

        if(!_id) return res.status(400).json({message: 'ID parameter is required!'})
        
        const findStudent = await Student.findByIdAndDelete(_id);

        if(!findStudent) return res.status(404).json({message: 'Student not found'});

        res.status(200).json({message: 'Student deleted successfully', findStudent});

    }catch(e) {
        res.status(500).json(e.message)
    }

}

export const getStudent = async(req, res) => {
    try {
        const _id =  req.params.id;

        if(!_id) return res.status(400).json({message: 'ID parameter is required!'})

        const student = await Student.findById(_id);

        if(!student) return res.status(404).json({message: 'Student not found'});

        res.status(200).json(student)
    }catch(e) {
        console.log(e.message);
    }
}

export const updateStudent = async(req, res) => {
    try {
        const _id = req.params.id;

        if(!_id) return res.status(400).json({message: 'ID parameter is required!'})

        const student = await Student.findByIdAndUpdate(_id, req.body, {returnOriginal: false});

        if(!student) return res.status(404).json({message:"Student not found"});

        await student.save();
        
        res.status(200).json({message:"Student updated successfully",success: true});
    }catch(e) { 
        console.log(e.message);
    }
}
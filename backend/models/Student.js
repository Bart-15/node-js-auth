import mongoose from 'mongoose';

const StudentSchema =  mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    lastName: {
        type:String,
        required: true  
    }
})

const Student =  mongoose.model('Student', StudentSchema);
export default Student;
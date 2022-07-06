import mongoose  from "mongoose";

const UserSchema =  mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken: [String]
})

const User = mongoose.model("User", UserSchema);
export default User;
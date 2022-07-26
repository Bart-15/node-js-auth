import mongoose  from "mongoose";

const UserSchema =  mongoose.Schema({
    userName: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 5000
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
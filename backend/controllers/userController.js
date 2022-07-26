
import User from '../models/User.js';

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({email:req.email}).select("-password -refreshToken -roles");

        if(!user) return res.status(404).json({message: 'User not found'});

        res.status(200).json(user);
    }catch(e){
        res.status(500).json(e.message);
    }
};

export const getUsers = async(req, res) => {
    try {
        const users = await User.find({}).select("-password -refreshToken");
        res.status(200).json(users)
    }catch(e){
        res.status(500).json(e.message);
    }
}

export const getUserData = async (req, res) => {
    try {
        const user =  await User.findById(req.params.id).select("-password -refreshToken");

        if(!user) return res.status(404).json({message: 'User not found'});

        res.status(200).json(user);
    }catch(e) {
        res.status(500).json(e.message);
    }
}

export const updateRoles = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user) return res.status(404).json({message: 'User not found'});

        user.roles = req.body.roles;
        await user.save();
        res.status(200).json(user);
    }catch(e) {
        res.status(500).json({message: e.message});
    }
}
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { validateNewUserInput } from '../validation/authInputValidation.js';


export const newUser = async (req, res) => {
    const {errors, isValid} = await validateNewUserInput(req.body);

    if(!isValid) return res.status(400).json(errors);
    try {
        // find in db
        const user = await User.findOne({email: req.body.email});

        if(user) return res.status(400).json({message:"Email is already taken"});

        const hashedPass = bcrypt.hashSync(req.body.password, 10);

        const newUser = await new User({
            name: req.body.name,
            lastName: req.body.lastName,
            roles: {"User":5000},
            email: req.body.email,
            password: hashedPass
        }).save();

        res.status(200).json({
            success: true,
            newUser
        })
    }catch(e) {
        res.status(500).json(e.message)
    }
}


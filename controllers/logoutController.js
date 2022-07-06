import User from '../models/User.js';


const handleLogout =  async(req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); //No content

    const refreshToken = cookies.jwt;

    const userFound = await User.findOne({refreshToken});
    
    try{
        /*
           user not found cookie.
        */ 
        if(!userFound){
            res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: false})
            return res.sendStatus(204);
        }
        
        userFound.refreshToken = userFound.refreshToken.filter(refreshT =>  refreshT !== refreshToken);

        await userFound.save();

        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: false});  //secure: true - only serves on https

        res.sendStatus(204);
    }catch(err){
        res.status(500).json({message: err.message});
    }

}

export default handleLogout;
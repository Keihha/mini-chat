const jwt = require('jsonwebtoken');
const User = require('./../models/user');

const checkJwt = async (token = '') => {
    try{

        if(token<10){
            console.log('aca no no?');
            return null;
        };

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user  = await User.findById(uid);

        if(!user || !user.state){
            return null;
        };
        
        return user;

    }catch(err){
        console.log(err);
        return null;
    };
};


module.exports = {checkJwt};
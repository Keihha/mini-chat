const User = require('../models/user');

const emailAlreadyUser = async (email) =>{
    
    const emailExist = await User.findOne({email});
    
    if(emailExist){
        throw new Error(`El email: ${email} ya esta registrado`);
    }
}

const idValidator = async (id) =>{
    
    const idExist = await User.findById(id);
    
    if(!idExist){
        throw new Error(`El id: ${id} no existe`);
    }
}

module.exports={
    emailAlreadyUser,
    idValidator,
}
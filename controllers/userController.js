const Users=require('../models/user.js');
const jwt=require('jsonwebtoken');

//Generatig token for the user who is logging in
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.SECRET_KEY, {
        expiresIn: '5h'
    });
};

//Retrieve all the users registered to our application
exports.getAllUsers= async(req,res)=>{
    try{
        const users=await Users.find();
        res.status(200).send(users);
    }catch(error){
        res.status(500).send({message:'Error fetching all users',error:error.message});
    }
};

//Logging in user
exports.loginUser=async (req,res)=>{
    try{
        const {emailId,password}=req.body
        const user=await Users.findOne({emailId});
        if(user && await user.matchPassword(password)){
            const token=generateToken(user._id,user.role);
            res.status(200).send({
                _id: user._id,
                userName: user.userName,
                role: user.role,
                token: token
            });
        }
        else{
            return res.status(400).send({message:'Invalid Credentials..'});
        }
    }catch(error){
        res.status(500).send({message:'Error Logging In',error:error.message});
    }
};

//Registering the user
exports.registerUser=async(req,res)=>{
    try{
        const emailId=req.body.emailId;
        const phoneNumber=req.body.phoneNumber;
        const regEx=/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if(!emailId.match(regEx)){
            return res.status(201).send({message:'Invalid email id'});
        }
        if(phoneNumber<1000000000 || phoneNumber>9999999999){
            return res.status(201).send({message:'Invalid phone number'})
        }
        const userExist=await Users.findOne({emailId});
        if(userExist){
            return res.status(400).send({message:'User already exists'});
        }
        const user=new Users({
            userName:req.body.userName,
            phoneNumber:req.body.phoneNumber,
            emailId:req.body.emailId,
            password:req.body.password,
            role:req.body.role
        });
        await user.save();
        res.status(200).send({message:'User registered successfully...',user});
    }catch(error){
        res.status(500).send({message:'Error registering user',error:error.message});
    }
};

//Retrieve the user details who is logged into our application
exports.getUserProfile = async (req, res) => {
    try{
        const uid=req.user.id;
        const user = await Users.findById(uid);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });   
        }
        res.status(200).send({
            _id: user._id,
            userName: user.userName,
            emailId:user.emailId,
            phoneNumber:user.phoneNumber,
            role: user.role
        });
    }catch(error){
        res.status(500).send({message:'Error fetching profile of user',error:error.message});
    }
};

//Delete user from the database can only be done by admin
exports.deleteUser=async(req,res)=>{
    try{
        const id=req.params.id;
        const user=await Users.findById(id);
        if(!user){
            return res.status(404).send({message:'User not found'});
        }
        await Users.findByIdAndDelete(id);
        res.status(200).send({message:'User deleted successfully'});
    }catch(error){
        res.status(500).send({message:'Error deleting user',error:error.message});
    }
}
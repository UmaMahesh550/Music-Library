const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number
    },
    emailId: {
        type: String,
        required: true
    },
    password :{
        type: String,
        required: true
    },
    role : {
        type: String,
        required:true,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// Compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Users = mongoose.model('Users',userSchema);

module.exports=Users;
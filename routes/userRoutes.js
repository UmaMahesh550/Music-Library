const express= require('express');
const router=express.Router();

const {getAllUsers,loginUser,registerUser,getUserProfile, deleteUser
}= require('../controllers/userController.js');

const{protect,admin}=require('../middleware/authMiddleware.js');

router.get('/',getAllUsers); //route to retrieve all the users
router.post('/login',loginUser); //route to login the user
router.post('/register',registerUser); //route to register the number
router.get('/profile',protect,getUserProfile); //route to fetch details of the user loggedIn
router.delete('/:id',deleteUser);

module.exports=router;
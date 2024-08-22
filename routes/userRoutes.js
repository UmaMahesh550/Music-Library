const express= require('express');
const router=express.Router();

const {getAllUsers,loginUser,registerUser,getUserProfile, deleteUser
}= require('../controllers/userController.js');

const{protect,admin}=require('../middleware/authMiddleware.js');

router.get('/',getAllUsers);
router.post('/login',loginUser);
router.post('/register',registerUser);
router.get('/profile',protect,getUserProfile);
router.delete('/:id',protect,admin,deleteUser);

module.exports=router;
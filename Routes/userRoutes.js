const userController=require('../controllers/usercontrollers.js')
const express=require("express")

const router=express.Router()

router.post('/register',userController.userRegister)
router.post('/login',userController.userLogin)
module.exports=router
const express= require ('express')
const router= express.Router();
const userController = require ('../controller/userController')

//login
router.get('/login',userController.loadLogin)
router.post('/login',userController.login)

//register
router.get('/register',userController.loadRegister)
router.post('/register',userController.registerUser)

//home
router.get('/home',userController.loadHome);

//logout
router.post('/logout', userController.logout);

module.exports = router
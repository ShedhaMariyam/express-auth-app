const express= require ('express')
const router = express.Router();
const adminController = require('../controller/adminController')



router.get('/login',adminController.loadLogin)
router.post('/login',adminController.logIn);

router.get('/dashBoard',adminController.loadDashBoard)


// Search
router.get('/users/search', adminController.searchUsers);

// Add User
router.get('/users/add', adminController.loadAddUser);
router.post('/users/add', adminController.addUser);

// Edit User
router.get('/users/edit/:id', adminController.loadEditUser);
router.post('/users/edit/:id', adminController.editUser);

// Delete User
router.get('/users/delete/:id', adminController.deleteUser);


router.post('/logout',adminController.logout)

module.exports = router
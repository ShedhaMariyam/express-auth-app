
//importing required modules
const router = require('../routes/user')
const adminModel = require ('../model/adminModel.js')
const bcrypt = require ('bcrypt')
const userModel= require('../model/userModel.js')

const saltround =10; // for bcrypt hashing




//admin login
const logIn = async (req,res)=>{
    try{

        const {email,Password}= req.body
        const admin= await adminModel.findOne({email})

        if(!admin) return res.render('admin/login',{message : "Invalid credential,Admin Access Denied"})

        const isMatch= await bcrypt.compare(Password,admin.Password)
        if(!isMatch) return res.render('admin/login',{message : "Invalid credential,Admin Access Denied"})        
        
         req.session.admin=admin._id; //creating session

         res.redirect('/admin/dashBoard')   

    }catch(error){
        res.send(error)
    }
}

// Load login page (GET)

const loadLogin = async (req,res)=> {
    if (req.session.admin) return res.redirect('/admin/dashBoard');

    res.render('admin/login')
}

//load dashBoard with users
const loadDashBoard = async (req,res)=>{

    try{
        const admin = req.session.admin
        if(!admin) return res.redirect ('/admin/login')

        const users = await userModel.find({}) //fetch all users from DB

        res.render('admin/dashBoard',{users})

    }catch(error){
         console.error(error);
        res.send("Something went wrong");
    }
}


//searching by name/email
const searchUsers = async (req, res) => {
  try {
    const query = req.query.q; //Get search text from query string
    const users = await userModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    }).lean();

   

    res.render('admin/dashBoard', { users });
  } catch (error) {
    console.error(error);
    res.send("Error searching users");
  }
};

// Add User
const loadAddUser = (req, res) => {
  res.render('admin/addUser');
};

const addUser = async (req, res) => {
  try {
    const { name, email, Password } = req.body;
    const hashedPassword = await bcrypt.hash(Password, saltround);
    const newUser = new userModel({ name, email, Password: hashedPassword });
    await newUser.save();
    res.redirect('/admin/dashBoard');
  } catch (error) {
    console.error(error);
    res.send("Error adding user");
  }
};

// load edit form with userdata
const loadEditUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).lean();
    res.render('admin/editUser', { user });
  } catch (error) {
    console.error(error);
    res.send("Error loading edit form");
  }
};

//update user in DB
const editUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    await userModel.findByIdAndUpdate(req.params.id, { name, email });
    res.redirect('/admin/dashBoard');
  } catch (error) {
    console.error(error);
    res.send("Error editing user");
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashBoard');
  } catch (error) {
    console.error(error);
    res.send("Error deleting user");
  }
};

//logout(destroy session)
const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); 
    res.redirect('/admin/login');
  });
};

module.exports = {loadLogin,logIn,loadDashBoard,logout,searchUsers,editUser,addUser,deleteUser,loadAddUser,loadEditUser}
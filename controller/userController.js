
const userSchema = require('../model/userModel')
const bcrypt = require ('bcrypt')
const saltround =10;



//User registration
const registerUser = async (req,res)=>
{
    try{
        const {name,email,Password} = req.body

        const user = await userSchema.findOne({email})
        if(user) return res.render('user/register',{message : "User already exist"})

        const hashedPassword = await bcrypt.hash(Password,saltround);


        const newUser = new userSchema(
            {
                name,
                email,
                Password:hashedPassword
            })
            await newUser.save()
            res.render('user/login',{message : "User created Successfully"})
    } 
    catch (error){
         console.error(error);
         res.render('user/register', { message: "Something went wrong, try again" });
    }
} 


//User Login
const login= async (req,res)=>{
    try{
        const {email,Password}=req.body
        const user = await userSchema.findOne({email})
        
        if(!user) return res.render ('user/register',{message : `User does not exist, Register to Login`})

        const isMatch= await bcrypt.compare(Password,user.Password)
        
        if(!isMatch) return res.render('user/login',{message : `Incorrect Password`})

    
        req.session.user = user._id;
        res.redirect('/user/home');
        
       

    }
    catch (error){
        console.error(error);
        res.render('user/login', { message: "Something went wrong, try again" });
    }
}


//Load login page
const loadLogin= (req,res)=>{
  
  if (req.session.user) return res.redirect('/user/home');
  res.render('user/login');
}

//Load register page
const loadRegister = (req,res)=> {
        res.render('user/register');
} 

//Load Home page
const loadHome= async (req,res)=>{
   if (!req.session.user) return res.redirect('/user/login');

  const user = await userSchema.findById(req.session.user);
  res.render('user/userHome', { name: user.name });
}

//user logout
const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); // clear session cookie
    res.redirect('/user/login');
  });
};


module.exports={registerUser,loadLogin,loadRegister,login,loadHome,logout} 
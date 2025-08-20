

const mongoose = require ('mongoose');

const adminSchema =new mongoose.Schema({
    name:{
        type: String,
        required  : true,
    },
    email:{
        type:String,
        required : true,

    },
    Password:{
        type: String,
        required :true,
    }
});

module.exports = mongoose.model("admin",adminSchema)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  },
  phone:{
    type:String,
    required:true,
  
  },
  role:{
    type:String,
    default:"buyer",
    enum:["admin","buyer","seller"]
  },
  profilePic:{
    type:String,
    default:""
  },
  address:{
    type:String,
  },
  status:{
    type:String,
    default:"active",
    enum:["active","inactive","deleted","blocked"]
  },
  create_date:{
    type:Date,
    default:Date.now
  }
})

module.exports = mongoose.model("users",userSchema)
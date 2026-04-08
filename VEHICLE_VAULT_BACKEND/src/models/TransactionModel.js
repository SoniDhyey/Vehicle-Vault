const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  
  buyer_id:{
    type:Schema.Types.ObjectId,
    ref:"users",
    required:true
  },
  vehicle_id:{
    type:Schema.Types.ObjectId,
    ref:"vehicles",
    required:true
  },
  amount:{
    type:Number,
    required:true
  },
  payment_method:{
    type:String,
    enum:["credit_card","debit_card","bank_transfer"]
},
  payment_status:{
    type:String,
    enum:["paid","pending"],
    default:"pending"
  },
  Transaction_status:{
    type:String,
    enum:["completed","processing"],
    default:"processing"
  },
  payment_date:{
    type:Date,
    default:Date.now
  }
})

module.exports = mongoose.model("transactions", transactionSchema)
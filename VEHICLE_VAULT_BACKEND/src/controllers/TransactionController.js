const TransactionModel = require("../models/TransactionModel");

const createTransaction = async(req,res)=>{

  try{
    const transaction = await TransactionModel.create(req.body)

    res.status(201).json({
      message:"Transaction completed",
      data:transaction
    })
  }catch(err){
    res.status(500).json({
      message:"Error while creating transaction",
      err:err
    })
  }
}

const getAllTransaction = async(req,res) =>{
  try{
    const transaction = await TransactionModel.find()

    res.status(200).json({
      message:"Transactions fetched",
      data:transaction
    })
  } catch(err){
    res.status(500).json({
      message:"Error while fetching transactions",
      err:err
    })
  }
}
// UPDATE TRANSACTION
const updateTransaction = async (req,res) => {

  try{

    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    )

    res.status(200).json({
      message:"Transaction updated successfully",
      data:updatedTransaction
    })

  }catch(err){

    res.status(500).json({
      message:"Error while updating transaction",
      err:err
    })

  }

}


// DELETE TRANSACTION
const deleteTransaction = async (req,res) => {

  try{

    await TransactionModel.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message:"Transaction deleted successfully"
    })

  }catch(err){

    res.status(500).json({
      message:"Error while deleting transaction",
      err:err
    })

  }

}

module.exports = {
  createTransaction,
  getAllTransaction,
  updateTransaction,
  deleteTransaction
}
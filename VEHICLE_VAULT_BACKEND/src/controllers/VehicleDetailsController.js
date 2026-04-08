const VehicleDetailsModel = require("../models/VehicleDetailsModel");

// ADD VEHICLE DETAILS
const addVehicleDetails = async (req,res) => {

    try{

        const details = await VehicleDetailsModel.create(req.body)

        res.status(201).json({
            message:"Vehicle details added",
            data:details
        })

    }catch(err){

        res.status(500).json({
            message:"Error adding vehicle details",
            error:err.message
        })

    }

}

// GET VEHICLE DETAILS
const getVehicleDetails = async (req,res) => {

    try{

        const details = await VehicleDetailsModel.findOne({
            vehicle_id:req.params.vehicle_id
        })

        res.status(200).json({
            message:"Vehicle details fetched",
            data:details
        })

    }catch(err){

        res.status(500).json({
            message:"Error fetching vehicle details",
            error:err.message
        })

    }

}
const updateVehicleDetails = async (req,res) => {

  try{

    const updatedDetails = await VehicleDetailsModel.findOneAndUpdate(
      { vehicle_id: req.params.vehicle_id },
      req.body,
      { new:true }
    )

    res.status(200).json({
      message:"Vehicle details updated successfully",
      data:updatedDetails
    })

  }catch(err){

    res.status(500).json({
      message:"Error updating vehicle details",
      error:err.message
    })

  }

}
const deleteVehicleDetails = async (req,res) => {

  try{

    await VehicleDetailsModel.findOneAndDelete({
      vehicle_id:req.params.vehicle_id
    })

    res.status(200).json({
      message:"Vehicle details deleted successfully"
    })

  }catch(err){

    res.status(500).json({
      message:"Error deleting vehicle details",
      error:err.message
    })

  }

}

module.exports = {
    addVehicleDetails,
    getVehicleDetails,
    updateVehicleDetails,
    deleteVehicleDetails
}

const VehicleImgModel = require("../models/VehicleImgModel");

// ADD VEHICLE IMAGE
const addVehicleImage = async (req,res) => {

    try{

        const savedImage = await VehicleImgModel.create({

            vehicle_id:req.body.vehicle_id,
            image_url:req.file.path   //cloudinary URL
        })

        res.status(201).json({
            message:"Vehicle image added successfully",
            data:savedImage
        })

    }catch(err){

        res.status(500).json({
            message:"Error while adding vehicle image",
            error:err.message
        })

    }

}

// GET VEHICLE IMAGES
const getVehicleImages = async (req,res) => {

    try{

        const images = await VehicleImgModel.find({vehicle_id:req.params.vehicle_id})

        res.status(200).json({
            message:"Vehicle images fetched",
            data:images
        })

    }catch(err){

        res.status(500).json({
            message:"Error while fetching images",
            error:err.message
        })

    }

}
// UPDATE VEHICLE IMAGE
const updateVehicleImage = async(req,res) => {

    try{

        const updatedImage = await VehicleImgModel.findByIdAndUpdate(
            req.params.id,
          {

              vehicle_id:req.body.vehicle_id,
              image_url:req.file?req.file.path:req.body.image

          },
            {new:true}
        )

        res.status(200).json({
            message:"Vehicle image updated successfully",
            data:updatedImage
        })

    }catch(err){

        res.status(500).json({
            message:"Error while updating image",
            error:err.message
        })

    }

}


// DELETE VEHICLE IMAGE
const deleteVehicleImage = async(req,res) => {

    try{

        await VehicleImgModel.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message:"Vehicle image deleted successfully"
        })

    }catch(err){

        res.status(500).json({
            message:"Error while deleting image",
            error:err.message
        })

    }

}

module.exports = {
    addVehicleImage,
    getVehicleImages,
    updateVehicleImage,
    deleteVehicleImage
}
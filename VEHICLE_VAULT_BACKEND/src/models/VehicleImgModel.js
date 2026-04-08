const mongoose = require("mongoose");

    const vehicleImgSchema = new mongoose.Schema({
        vehicle_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"vehicles",
            required:true
        },

        image_url:{
            type:String,
            required:true
        },

        is_primary:{
            type:Boolean,
            default:false
        }
    },{timestamps:true});

    module.exports = mongoose.model("vehicle_images",vehicleImgSchema);
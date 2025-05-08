const roomModel = require('../Models/roomModel')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')
const express = require('express')
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

// Express middleware setup for file uploads
exports.setupFileUpload = express.Router().use(fileUpload({
  useTempFiles: true,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}))

exports.addRoom = async (req, res) => {
  try {
    console.log("Adding room with data:", req.body);
    console.log("Image URLs being saved:", req.body.imageUrls);

    const roomData = new roomModel(req.body)
    const saveData = await roomData.save()

    // console.log("Room saved successfully with data:", saveData);

    return res.status(200).json({ status: true, message: "Room added successfully", data: saveData })

  } catch (error) {
    console.log("-------Add Room 11--------", error);
    return res.status(401).json({ success: false, message: `Failed to add room, ${error}` });
  }
}

exports.getAllRooms = async (req, res) => {
  try {
    const allRooms = await roomModel.find()
      .populate({
        path: 'hotelId',
        populate: {
          path: 'locationId',
          model: 'locations',
          populate: {
            path: 'stateId',
            model: 'states'
          }
        }
      })

    return res.status(200).json({ status: true, message: "Fetched all the rooms", data: allRooms })
  } catch (error) {
    console.log("------- Fetch Room 22--------", error);
    return res.status(401).json({ success: false, message: `Failed to fetch room, ${error}` });
  }
}

exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params
    const formData = req.body

    // console.log("Updating room with ID:", id);
    console.log("Update data:", formData);
    // console.log("Image URLs in update:", formData.imageUrls);

    const updatedRoom = await roomModel.findByIdAndUpdate(id, formData, { new: true })

    if (!updatedRoom) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    console.log("Room updated successfully:", updatedRoom);

    return res.status(200).json({ success: true, message: "Room updated successfully", data: updatedRoom });
  } catch (error) {
    console.log("------- Update Room --------", error);
    return res.status(401).json({ success: false, message: `Failed to update room, ${error}` });
  }
}

exports.deleteRoom = async (req, res) => {

  try {
    const { id } = req.params;
    const findRoom = await roomModel.findByIdAndDelete(id)
    return res.status(200).json({ success: true, message: "Room Deleted successfully", });

  } catch (error) {
    console.log("------- Delete Room 52 --------", error);
    return res.status(401).json({ success: false, message: `Failed to Delete room, ${error}` });
  }
}
exports.disableRoom = async (req, res) => {

  try {
    const { id } = req.params;

    const findRoom = await roomModel.findByIdAndUpdate(id)
    const disableRoom = await roomModel.findByIdAndUpdate(id, { isDisable: !findRoom.isDisable }, { new: true })

    return res.status(200).json({ success: true, message: "Room Deleted successfully", });

  } catch (error) {
    console.log("------- Delete Room 52 --------", error);
    return res.status(401).json({ success: false, message: `Failed to Delete room, ${error}` });
  }
}

// New function to handle image uploads
exports.uploadImages = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || !req.files.images) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    let imageFiles = req.files.images;

    // Convert to array if single file
    if (!Array.isArray(imageFiles)) {
      imageFiles = [imageFiles];
    }

    // Array to store upload results
    const uploadResults = [];

    // Upload each image to Cloudinary
    for (const file of imageFiles) {
      try {
        // Create a temporary path for the file
        const tempFilePath = file.tempFilePath;

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            tempFilePath,
            {
              folder: 'hms_room_images',
              resource_type: 'image'
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
        });

        // Store the URL
        uploadResults.push(result.secure_url);
      } catch (error) {
        console.error('Error uploading file:', error);
        // Continue with other files if one fails
      }
    }

    // Return success response with URLs
    return res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      urls: uploadResults
    });
  } catch (error) {
    console.error('Error in uploadImages:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to upload images: ${error.message}`
    });
  }
}

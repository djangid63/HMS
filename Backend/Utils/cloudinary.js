require('dotenv').config()
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

exports.uploadFile = async (files) => {

  const fileArray = Object.values(files); // Convert files object to an array
  const results = []; // This will store the result of each upload

  // Upload each file one by one
  for (const file of fileArray) {
    try {
      const result = await new Promise((resolve, reject) => {
        // Upload the file to Cloudinary
        cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) {
              reject(error); // Reject if there's an error
            } else {
              resolve(result); // Resolve with the result if upload is successful
            }
          }
        ).end(file.data); // Start uploading the file
      });

      results.push(result); // Store the result of the upload
    } catch (error) {
      console.error('Error uploading file:', error); // Log the error if upload fails
    }
  }

  return results; // Return the list of upload results
};


exports.uploadProfilePicture = async (imageData, userId) => {
  try {
    // Return null if no image data is provided
    
    if (!imageData) {
      console.log('No image data provided');
      return null;
    }


    const publicId = `profile_pictures/${userId}`; 

    // Use the direct upload method for base64 strings
    const result = await cloudinary.uploader.upload(imageData, {
      public_id: publicId,
      overwrite: true,
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' }
      ]
    });

    console.log('Upload successful:', result.secure_url);
    return result.secure_url; // Return just the secure URL for storing in the database
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

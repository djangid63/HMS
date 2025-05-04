const hotelModel = require('../Models/hotelModel')
const roomModel = require('../Models/roomModel')

exports.addHotel = async (req, res) => {
  try {
    const hotelData = new hotelModel(req.body)
    const saveData = await hotelData.save()
    return res.status(200).json({ status: true, message: "Hotel added successfully", data: saveData })
  } catch (error) {
    console.log("-------Hotel--------", error);
    return res.status(401).json({ success: false, message: `Failed to add hotel, ${error}` });
  }
}

exports.getAllHotel = async (req, res) => {
  try {
    const hotelData = await hotelModel.find().populate({
      path: 'locationId',
      populate: {
        path: 'stateId',
        model: 'states'
      }
    });
    return res.status(200).json({ success: true, message: "Hotels fetched Successfully", data: hotelData })
  } catch (error) {
    console.log("Get hotel--------", error);
    return res.status(401).json({ success: false, message: `Failed to get hotels, ${error}` });
  }
}

exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Hotel ID is required" });
    }

    const updatedHotel = await hotelModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
      data: updatedHotel
    });
  } catch (error) {
    console.log("Update hotel error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to update hotel: ${error.message}`
    });
  }
}

exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Hotel ID is required"
      });
    }

    const deletedHotel = await hotelModel.findByIdAndDelete(id);

    if (!deletedHotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel deleted successfully"
    });
  } catch (error) {
    console.log("Delete hotel error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to delete hotel: ${error.message}`
    });
  }
}

exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Hotel ID is required"
      });
    }

    const hotel = await hotelModel.findById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    const disableHotel = await hotelModel.findByIdAndUpdate(
      id,
      { isDisable: !hotel.isDisable },
      { new: true }
    );

    if (!disableHotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    // Update all rooms associated with this hotel to match the hotel's disabled status
    const roomUpdateResult = await roomModel.updateMany(
      { hotelId: id },
      { isDisable: disableHotel.isDisable }
    );


    return res.status(200).json({
      success: true,
      message: "Hotel disabled successfully"
    });
  } catch (error) {
    console.log("Soft delete hotel error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to disable hotel: ${error.message}`
    });
  }
}

exports.hardDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Hotel ID is required"
      });
    }

    const deleteLocation = await hotelModel.findByIdAndDelete(id);

    if (!deleteLocation) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel deleted successfully"
    });
  } catch (error) {
    console.log("Hard delete hotel error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to delete hotel: ${error.message}`
    });
  }
}
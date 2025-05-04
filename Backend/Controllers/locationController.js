const locationModel = require('../Models/locationModel');
const stateModel = require('../Models/stateModel');
const hotelModel = require('../Models/hotelModel');
const roomModel = require('../Models/roomModel');

exports.addLocation = async (req, res) => {
  try {
    const { name, code, stateId } = req.body;
    const existingLocation = await locationModel.findOne({ name })

    if (existingLocation) {
      return res.status(409).json({ success: false, message: "Location already exists" })
    }
    const locationData = new locationModel({ name, code, stateId })
    const saveData = await locationData.save()
    return res.status(200).json({ status: true, message: "Location added successfully", updatedLocation: saveData })
  } catch (error) {
    console.log("-------Location--------", error);
    return res.status(401).json({ success: false, message: `Failed to add location, ${error}` });
  }
}

exports.getAllLocations = async (req, res) => {
  try {
    const locationData = await locationModel.find().populate('stateId');
    // console.log(locationData);
    return res.status(200).json({ status: true, message: "Location fetched Successfully", location: locationData })
  } catch (error) {
    console.log("Get location--------", error);
    return res.status(401).json({ success: false, message: `Failed to get location, ${error}` });
  }
}

exports.getLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const locationData = await locationModel.find({ stateId: id }).populate('stateId');
    // console.log("locations filtered by stateId:", locationData);
    return res.status(200).json({ status: true, message: "Location fetched Successfully", location: locationData })
  } catch (error) {
    console.log("Get location--------", error);
    return res.status(401).json({ success: false, message: `Failed to get location, ${error}` });
  }
}

exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const existingLocation = await locationModel.findOne({ name })

    if (existingLocation) {
      return res.status(409).json({ success: false, message: "Location already exists" })
    }

    if (!id) {
      return res.status(400).json({ success: false, message: "Location ID is required" });
    }

    const updatedLocation = await locationModel.findByIdAndUpdate(
      id,
      { name, code },
      { new: true, }
    );

    if (!updatedLocation) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location: updatedLocation
    });
  } catch (error) {
    console.log("Update location error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to update location: ${error.message}`
    });
  }
}


exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Location ID is required"
      });
    }


    const location = await locationModel.findById(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found"
      });
    }

    if (location.isDisable === true) {
      const existingState = await stateModel.findById(location.stateId);
      if (!existingState || existingState.isDisable === true) {
        return res.status(404).json({
          success: false,
          message: "Cannot enable this location because its associated state is not found or is disabled"
        });
      }
    }

    const disabledLocation = await locationModel.findByIdAndUpdate(
      id,
      { isDisable: !location.isDisable },
      { new: true }
    );

    if (!disabledLocation) {
      return res.status(404).json({
        success: false,
        message: "Location not found"
      });
    }

    await hotelModel.updateMany(
      { locationId: id },
      { isDisable: disabledLocation.isDisable }
    );

    const hotels = await hotelModel.find({ locationId: id });
    const hotelIds = hotels.map(hotel => hotel._id);
    await roomModel.updateMany(
      { hotelId: hotelIds },
      { isDisable: disabledLocation.isDisable }
    );

    return res.status(200).json({
      success: true,
      message: "Location disabled successfully"
    });
  } catch (error) {
    console.log("Soft delete location error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to disable location: ${error.message}`
    });
  }
}

exports.hardDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Location ID is required"
      });
    }

    const hotels = await hotelModel.find({ locationId: id });
    const hotelIds = hotels.map(hotel => hotel._id);

    await roomModel.deleteMany({ hotelId: hotelIds });

    await hotelModel.deleteMany({ locationId: id });

    const deleteLocation = await locationModel.findByIdAndDelete(id);

    if (!deleteLocation) {
      return res.status(404).json({
        success: false,
        message: "Location not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location and all associated hotels and rooms deleted successfully"
    });
  } catch (error) {
    console.log("Hard delete location error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to delete location: ${error.message}`
    });
  }
}
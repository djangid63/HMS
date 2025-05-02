const locationModel = require('../Models/locationModel')

exports.addLocation = async (req, res) => {
  const { name, code, stateId } = req.body;
  try {
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
  console.log(req.params);
  try {
    const { stateId } = req.params
    const locationData = await locationModel.find({ stateId }).populate('stateId');
    console.log("all the location", locationData);
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

    const deleteLocation = await locationModel.findByIdAndDelete(id);

    if (!deleteLocation) {
      return res.status(404).json({
        success: false,
        message: "Location not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location deleted successfully"
    });
  } catch (error) {
    console.log("Hard delete location error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to delete location: ${error.message}`
    });
  }
}
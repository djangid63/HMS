const stateModel = require('../Models/stateModel')
const locationModel = require('../Models/locationModel')

exports.addState = async (req, res) => {
  const { state, code } = req.body;
  try {
    const stateData = new stateModel({ state, code })
    const saveData = await stateData.save()
    return res.status(200).json({ status: true, message: "State added successfully", updatedState: saveData })
  } catch (error) {
    console.log("-------State--------", error);
    return res.status(401).json({ success: false, message: `Failed to add state, ${error}` });
  }
}

exports.getAllStates = async (req, res) => {
  try {
    const stateData = await stateModel.find({ isDisable: false });
    return res.status(200).json({ status: true, message: "State fetched Successfully", state: stateData })
  } catch (error) {
    console.log("Get state--------", error);
    return res.status(401).json({ success: false, message: `Failed to get state, ${error}` });
  }
}

exports.updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state, code } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "State ID is required" });
    }

    const updatedState = await stateModel.findByIdAndUpdate(
      id,
      { state, code },
      { new: true, }
    );

    if (!updatedState) {
      return res.status(404).json({ success: false, message: "State not found" });
    }

    return res.status(200).json({
      success: true,
      message: "State updated successfully",
      state: updatedState
    });
  } catch (error) {
    console.log("Update state error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to update state: ${error.message}`
    });
  }
}


exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "State ID is required"
      });
    }

    const state = await stateModel.findById(id);
    // console.log("state by stateCon 71", state);

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found"
      });
    }

    const disabledLocation = await stateModel.findByIdAndUpdate(
      id,
      { isDisable: !state.isDisable },
      { new: true }
    );

    if (!disabledLocation) {
      return res.status(404).json({
        success: false,
        message: "State not found"
      });
    }

    // Update locations with the same isDisable value as the state
    const disableLocation = await locationModel.updateMany(
      { stateId: id },
      { isDisable: disabledLocation.isDisable }
    );
    console.log("disableLoaciton---------------", disableLocation);

    return res.status(200).json({
      success: true,
      message: "State disabled successfully"
    });
  } catch (error) {
    console.log("Soft delete state error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to disable state: ${error.message}`
    });
  }
}

exports.hardDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "State ID is required"
      });
    }

    const deleteLocation = await stateModel.findByIdAndDelete(id);

    if (!deleteLocation) {
      return res.status(404).json({
        success: false,
        message: "State not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "State deleted successfully"
    });
  } catch (error) {
    console.log("Hard delete state error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to delete state: ${error.message}`
    });
  }
}
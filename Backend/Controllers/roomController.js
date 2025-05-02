const roomModel = require('../Models/roomModel')

exports.addRoom = async (req, res) => {
  try {
    const roomData = new roomModel(req.body)
    const saveData = await roomData.save()

    return res.status(200).json({ status: true, message: "Room added successfully", data: saveData })

  } catch (error) {
    console.log("-------Add Room 11--------", error);
    return res.status(401).json({ success: false, message: `Failed to add room, ${error}` });
  }

}

exports.getAllRooms = async (req, res) => {
  try {
    const allRooms = await roomModel.find()
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
    const updatedRoom = await roomModel.findByIdAndUpdate(id, formData, { new: true })

    if (!updatedRoom) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

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

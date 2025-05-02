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
    const allRooms = roomModel.find()
    return res.status(200).json({ status: true, message: "Fetched all the rooms", data: allRooms })
  } catch (error) {
    console.log("------- Fetch Room 22--------", error);
    return res.status(401).json({ success: false, message: `Failed to fetch room, ${error}` });
  }
}


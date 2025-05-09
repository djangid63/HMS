const bookingModel = require('../Models/bookingModel')


exports.getBooking = async (req, res) => {
  try {
    const bookings = await bookingModel.find()
    res.status(200).json({ status: true, message: "Data found", data: bookings })
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.addBooking = async (req, res) => {
  try {
    const { roomId } = req.body;
    const existingBooking = await bookingModel.findOne({ roomId });
    if (existingBooking) {
      return res.status(409).json({ success: false, message: 'Room Booked already' })
    }

    const booking = new bookingModel(req.body);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    if (!id) {
      return res.status(400).json({ success: false, message: "Hotel ID is required" });
    }
    const { status } = req.body;
    const booking = await bookingModel.findByIdAndUpdate(id, { status }, { new: true })
    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking
    });
  } catch (error) {
    console.log("Update hotel error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to update Booking status: ${error.message}`
    });
  }
}
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
    const booking = new bookingModel(req.body);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
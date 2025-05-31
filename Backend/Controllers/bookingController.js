const bookingModel = require('../Models/bookingModel');
const { findById } = require('../Models/userModel');
const { bookingSuccess } = require('../Utils/emailService')

exports.getBooking = async (req, res) => {
  try {

    const bookings = await bookingModel.find().populate('userId');

    // const bookings = await bookingModel.aggregate([
    //   {
    //     $lookup: {
    //       from: 'usersdatas',
    //       localField: 'userId',
    //       foreignField: '_id',
    //       as: 'userBooking'
    //     }
    //   }
    // ]);

    // console.log("booookk", bookings);
    res.status(200).json({ status: true, message: "Data found", data: bookings })
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.addBooking = async (req, res) => {
  try {
    const { roomId } = req.body;
    const existingBooking = await bookingModel.findOne({ roomId });

    req.body.userId = req.user._id

    const booking = new bookingModel(req.body);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.updateBooking = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const { status, isChecking } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Booking ID is required" });
    }


    let updateFields = {};
    if (typeof status !== 'undefined') {
      updateFields.status = status;
    }
    if (typeof isChecking !== 'undefined') {
      updateFields.isChecking = isChecking;
    }

    const findBooking = await bookingModel.findById(id);
    if (!findBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const booking = await bookingModel.findByIdAndUpdate(id, updateFields, { new: true }).populate('userId');
    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking
    });

  } catch (error) {
    console.log("Update booking error:", error);
    return res.status(409).json({
      success: false,
      message: `Failed to update booking status: ${error.message}`
    });
  }
}
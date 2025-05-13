const bookingModel = require('../Models/bookingModel')
const { bookingSuccess } = require('../Utils/emailService')

exports.getBooking = async (req, res) => {
  try {
    // const bookings = await bookingModel.find().populate('userId');

    const bookings = await bookingModel.aggregate([
      {
        $lookup: {
          from: 'usersdatas',
          localField: 'userId',
          foreignField: '_id',
          as: 'userBooking'
        }
      }
    ]);


    console.log("booookk", bookings);

    res.status(200).json({ status: true, message: "Data found", data: bookings })
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.addBooking = async (req, res) => {
  try {
    const { roomId } = req.body;
    const existingBooking = await bookingModel.findOne({ roomId });

    // if (existingBooking) {
    //   return res.status(409).json({ success: false, message: 'Room Booked already' })
    // }

    req.body.userId = req.user._id

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
    const { status, isChecking } = req.body;

    // Determine which field to update based on the request body
    let updateFields = {};
    if (typeof status !== 'undefined') {
      updateFields.status = status;
    }
    if (typeof isChecking !== 'undefined') {
      updateFields.isChecking = isChecking;
    }
    console.log(status);

    const findBooking = await bookingModel.findById(id).populate('userId');
    console.log("findbooking controller 38", findBooking);


    if (!id) {
      return res.status(400).json({ success: false, message: "Hotel ID is required" });
    }

    const email = await bookingSuccess(findBooking.userId.email, findBooking.userId.firstname, findBooking.userId.lastname, findBooking.roomId, findBooking.checkInDate, findBooking.checkOutDate)

    if (!email) {
      return res.status(500).json({ success: false, message: "Failed to send booking success email" });
    }
    const booking = await bookingModel.findByIdAndUpdate(id, updateFields, { new: true })
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
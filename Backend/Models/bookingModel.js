const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotels",
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userPhone: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("bookings", bookingSchema);
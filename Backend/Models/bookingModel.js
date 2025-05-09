const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'rooms',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'usersData',
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
    status: {
      type: String,
      enum: ['Approve', 'Rejected', 'Pending'],
      default: 'Pending'
    },

    isChecking: {
      type: String,
      enum: ['Pending', 'Confirm', 'Cancel'],
      default: 'Pending'
    }

  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("bookings", bookingSchema);
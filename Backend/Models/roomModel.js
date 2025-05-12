const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hotel',
    required: [true, 'Hotel ID is required']
  },
  type: {
    type: String,
    required: [true, 'Room type is required'],
    enum: ['Standard', 'Deluxe', 'Suite', 'Premium', 'Executive']
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
    min: 1,
    max: 10
  },
  price: {
    type: Number,
    required: [true, 'Room price is required'],
    min: 0
  },
  amenities: [{
    type: String
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  isDisable: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  },
  imageUrls: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('rooms', roomSchema);

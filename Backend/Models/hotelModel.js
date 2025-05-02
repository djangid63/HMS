const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hotelSchema = new Schema({

  name: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  room: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  contactNo: {
    type: Number,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  isDisable: {
    type: Boolean,
    default: false,
  },
  locationId: {
    type: Schema.Types.ObjectId,
    ref: 'locations'
  }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('hotel', hotelSchema)
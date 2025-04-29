const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  state: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  isDisable: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('location', locationSchema)
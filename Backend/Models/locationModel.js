const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  stateId: {
    type: Schema.Types.ObjectId,
    ref: 'states'
  },
  name: {
    type: String,
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
  isDisable: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('location', locationSchema)
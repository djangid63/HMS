const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stateSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'usersData'
  },

  state: {
    type: String,
    required: true
  },

  code: {
    type: String,
    require: true
  },

  isDisable: {
    type: Boolean,
    default: false
  },
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('states', stateSchema)
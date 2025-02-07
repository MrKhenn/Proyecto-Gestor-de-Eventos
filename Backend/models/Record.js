const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Record', recordSchema);

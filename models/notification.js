const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  message: {
    type: String,
    required: true,
  }
});

const Notifications = mongoose.model('Notifications', notificationSchema);

module.exports = Notifications;
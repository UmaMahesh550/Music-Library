const mongoose = require('mongoose');

//Notification schema definition
const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  createdAt:{
    type: Date,
    default:Date.now
  },
  isRead:{
    type: Boolean,
    default:false
  }
});

const Notifications = mongoose.model('Notifications', notificationSchema);

module.exports = Notifications;
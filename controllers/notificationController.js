const Notifications=require('../models/notification.js');
  
//Retrieving all notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notifications.find().sort({createdAt:-1}); 
        res.status(200).send(notifications);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching notifications', error:error.message });
    }
};

//Retrieving all unread messages
exports.getAllUnreadNotifications=async(req,res)=>{
    try{
        const notifications=await Notifications.find({userId:req.user.id, isRead:false}).sort({createdAt:-1});
        if(notifications.length===0){
            return res.status(404).send({message:'No unread notifications found'});
        }
        res.status(200).send(notifications);
    }catch(error){
        res.status(500).send({ message: 'Error fetching unread notifications', error:error.message });
    }
}

//Retrieve notification based on it's id
exports.getNotificationById = async (req, res) => {
try {
    const notification = await Notifications.findById(req.params.id);
    if (!notification) {
    return res.status(404).send({ message: 'Notification not found' });
    }
    res.status(200).send(notification);
} catch (error) {
    res.status(500).send({ message: 'Error fetching notification', error });
}
};

//Retrieving all unread messages
exports.markNotificationAsRead=async(req,res)=>{
    try{
        const notification=await Notifications.findByIdAndUpdate(req.params.id,{ isRead:true },{ new: true });
        if(!notification){
            return res.status(404).send({message:'Notification not found'});
        }
        res.status(200).send({message:'Notification is read'});
    }catch(error){
        res.status(500).send({ message: 'Error marking notification as read', error:error.message });
    }
}

//Get count of unread messages of a user
exports.getUnreadNotificationsCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const unreadCount = await Notifications.countDocuments({ userId: userId, isRead: false });
        res.status(200).send({ unreadCount });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching unread notifications count', error: error.message });
    }
};

//Delete notification based on it id
exports.deleteNotification = async (req, res) => {
try {
    const notification = await Notifications.findByIdAndDelete(req.params.id);
    if (!notification) {
    return res.status(404).send({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully..' });
} catch (error) {
    res.status(500).send({ message: 'Error deleting notification', error });
}
};
const express= require('express');
const router=express.Router();

const {getAllNotifications,getNotificationById,deleteNotification, getAllUnreadNotifications, markNotificationAsRead, getUnreadNotificationsCount}=require('../controllers/notificationController.js');

const {protect, admin}=require('../middleware/authMiddleware.js');

router.get('/',protect,getAllNotifications);//route to fetch all notifications by a loggedIn user
router.get('/unread',protect,getAllUnreadNotifications);//route to fetch all unread notifications
router.get('/:id',protect,getNotificationById);//route to fetch notification by id by a loggedIn user
router.delete('/:id',protect,admin,deleteNotification);//route to delete notification by the admin
router.put('/:id/markAsRead',protect,markNotificationAsRead);//route to mark notification as read
router.get('/notifications/unreadCount',protect,getUnreadNotificationsCount);//route to get unread notifications count 

module.exports=router;
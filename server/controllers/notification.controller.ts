import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import NotificationModel from "../models/notificationModel";
import { NextFunction,Request,Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron";

//get all notification --only for admin
export const getNotification = CatchAsyncError(async (req:Request, res:Response, next: NextFunction) => {
    try {
        const notifications = await NotificationModel.find().sort({createdAt: -1 });
        res.status(201).json({
            success: true,
            notifications,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
});

 // update notification status --- only admin
 export const updateNotification = CatchAsyncError(async (req:Request, res:Response, next: NextFunction) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
        
        if(!notification){
            return next(new ErrorHandler("Notification not found", 400));
        }
        else {
            notification.status ? notification.status = "read" : notification?.status;
        }

        await notification?.save();

        const notifications = await NotificationModel.find().sort({createdAt: -1});
        res.status(201).json({
            success: true,
            notifications,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
 });

 // delete the notification
 cron.schedule("0 0 0 * * *", async ()=> {
    const thirtyDaysAdgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({status:"read", createdAt: {$lt: thirtyDaysAdgo}});
    console.log("Notification Deleted");
    
 });

 

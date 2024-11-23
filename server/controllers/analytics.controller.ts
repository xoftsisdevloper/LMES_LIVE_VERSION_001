import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { generateLast12MonthsData } from "../utils/analytics-generator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

//user analytics
export const getUserAnalytics = CatchAsyncError(async(res: Response, req: Request, next: NextFunction) => {
    try {
        const users  = await generateLast12MonthsData(userModel);

        res.status(200).json({
            success: true,
            users,
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400))
    }
});

// get Course analytics
export const getCourseAnalytics = CatchAsyncError(async(res: Response, req: Request, next: NextFunction) => {
    try {
        const courses  = await generateLast12MonthsData(CourseModel);

        res.status(200).json({
            success: true,
            courses,
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400))
    }
});

// get Order analytics
export const getOrderAnalytics = CatchAsyncError(async(res: Response, req: Request, next: NextFunction) => {
    try {
        const orders  = await generateLast12MonthsData(OrderModel);

        res.status(200).json({
            success: true,
            orders,
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400))
    }
});
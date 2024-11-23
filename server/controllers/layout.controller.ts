import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";
import { title } from "process";
//create layout
export const createLayout = CatchAsyncError(async (res: Response, req: Request, next: NextFunction) => {
    try {
        const { type } = req.body;
        const isTypeExist = await LayoutModel.findOne({ type });

        if (!isTypeExist) {
            return next(new ErrorHandler(`${type} already exist`, 404));
        }
        if (type === 'Banner') {
            const { image, title, subTitle } = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "layout"
            });
            const banner = {
                type: "Banner",
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },

                title,
                subTitle
            }
            await LayoutModel.create(banner);
        }

        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    };
                })
            );
            await LayoutModel.create({
                type: "FAQ",
                faq: faqItems,
            });
        }

        if (type === "Categories") {
            const { categories } = req.body;
            const categoryItems = await Promise.all(
                categories.map(async (category: any) => {
                    return {
                        title: category.title,
                    };
                })
            );
            await LayoutModel.create({
                type: "Categories",
                categories: categoryItems,
            });
        }

        res.status(200).json({
            success: true,
            message: "Layout Created Successfully",
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
});

// Edit layout 
export const editLayout = CatchAsyncError(async(res: Response, req: Request, next: NextFunction) => {
    try {
        const { type } = req.body;

        if (type === 'Banner') {
            const bannerData:any = LayoutModel.findOne({type: "Banner"});
            const { image, title, subTitle } = req.body;
            await cloudinary.v2.uploader.destroy(bannerData?.image.public_id);
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "layout"
            });
            const banner = {
                type: "Banner",
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },

                title,
                subTitle
            }
            await LayoutModel.findOneAndUpdate(bannerData._id,{banner});
        }

        if (type === "FAQ") {
            const { faq } = req.body;
            const faqData:any = LayoutModel.findOne({type: "FAQ"});
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    };
                })
            );
            await LayoutModel.findOneAndUpdate(faqData?._id , {
                type: "FAQ",
                faq: faqItems,
            });
        }

        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesData:any = LayoutModel.findOne({type: "Categories"});
            const categoryItems = await Promise.all(
                categories.map(async (category: any) => {
                    return {
                        title: category.title,
                    };
                })
            );
            await LayoutModel.findOneAndUpdate(categoriesData?._id, {
                type: "Categories",
                categories: categoryItems,
            });
        }

        res.status(200).json({
            success: true,
            message: "Layout Updated Successfully",
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
    }
});

//get Layout by Type
export const getLayoutByType = CatchAsyncError(async(res: Response, req: Request, next: NextFunction) => {
    try {
        const {type} = req.body;
        const layout = await LayoutModel.findOne({type});
        res.status(201).json({
            success: true,
            layout,
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
    }
});
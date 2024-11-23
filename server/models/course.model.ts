import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./user.model";  // Assuming you have a IUser interface for user documents

interface IComment extends Document {
    user: IUser;
    question: string;
    questionReplies: IComment[];
}

interface IReview extends Document {
    user: IUser;
    rating: number;
    comment: string;
    commentReplies: IComment[];
}

interface ILink extends Document {
    title: string;
    url: string;
}

interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object;
    videoSection: string;
    videoLengths: number;
    videoPlayer: string;
    links: ILink[];
    suggestions: string;
    questions: IComment[];
}

interface ICourse extends Document {
    name: string;
    description?: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: object;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequesties: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;
    priceType: "Free" | "Paid";  // Changed to string literal types for better typing
}

const reviewSchema = new Schema<IReview>({
    user: { type: Schema.Types.ObjectId, ref: "User" },  // Reference to IUser model
    rating: { type: Number, default: 0 },
    comment: { type: String },
    commentReplies: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // References to comments
});

const linkSchema = new Schema<ILink>({
    title: { type: String },
    url: { type: String },
});

const commentSchema = new Schema<IComment>({
    user: { type: Schema.Types.ObjectId, ref: "User" },  // Reference to IUser model
    question: { type: String },
    questionReplies: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // References to other comments
});

const courseDataSchema = new Schema<ICourseData>({
    title: { type: String },
    description: { type: String },
    videoUrl: { type: String },
    videoThumbnail: { type: Object },
    videoSection: { type: String },
    videoLengths: { type: Number },
    videoPlayer: { type: String },
    links: [linkSchema], // Array of ILink schema
    suggestions: { type: String },
    questions: [commentSchema] // Array of IComment schema
}, { timestamps: true });

const courseSchema = new Schema<ICourse>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    estimatedPrice: { type: Number },
    thumbnail: { 
        public_id: { required: true, type: String }, 
        url: { required: true, type: String }
    },
    tags: { type: String, required: true },
    level: { type: String, required: true },
    demoUrl: { type: String, required: true },
    benefits: [{ title: { type: String } }], // Array of objects with title
    prerequesties: [{ title: { type: String } }], // Array of objects with title
    reviews: [reviewSchema], // Array of IReview schema
    courseData: [courseDataSchema], // Array of ICourseData schema
    ratings: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 },
    priceType: {
        type: String,
        enum: ["Free", "Paid"],  // Values allowed for price type
        required: true,  // Enforce the presence of this field
        default: "Free"
    }
}, { timestamps: true });

// Creating models for course and course data
const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;

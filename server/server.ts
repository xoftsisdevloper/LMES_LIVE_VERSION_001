import { app } from "./app";
import connectDB from "./utils/db";
import {v2 as cloudinary} from "cloudinary";
require("dotenv").config();


//cloudinary configs
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
})
// Ensure PORT is defined and valid
const port = parseInt(process.env.PORT || '8081', 10);

try {
  app.listen(port, '127.0.0.1', () => {
    console.log(`Server is connected on port ${port}`);
    connectDB();
  });
} catch (error) {
  console.error("Failed to start server:", error);
}

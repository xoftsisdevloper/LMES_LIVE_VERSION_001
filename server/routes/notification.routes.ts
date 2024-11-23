import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getNotification } from "../controllers/notification.controller";
const notificationRoute = express.Router();

notificationRoute.get("/get-all-notifications",authorizeRoles('admin'), isAuthenticated, getNotification);
notificationRoute.put("/update-notification/:id", isAuthenticated, authorizeRoles("admin"), getNotification);
export default notificationRoute;
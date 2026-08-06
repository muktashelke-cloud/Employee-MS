import express from "express";

import {
  getNotifications,
  markAllRead
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/:userId", getNotifications);


router.put("/read/:userId", markAllRead);

export default router;
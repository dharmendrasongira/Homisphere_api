import express from "express";
import {
  getChats,
  getChat,
  addChat,
  readChat,
} from "../controllers/chat.controller.js";
import { verifytoken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get("/", verifytoken, getChats);
router.get("/:id", verifytoken, getChat);
router.post("/", verifytoken, addChat);
router.put("/read/:id", verifytoken, readChat);

export default router;
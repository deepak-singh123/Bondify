import express from "express";
import { isauthenticated } from "../middlware/isAuthenticated.js";
import { deleteMessage, getMessages, markasread, sendmessage, unreadmessages, uploadchatimage } from "../controllers/messages.js";
import upload from "../middlware/multer.js";

const messageroutes = express.Router();
messageroutes.post("/send/:id", isauthenticated, sendmessage);
messageroutes.get("/getmessages/:id", isauthenticated, getMessages);
messageroutes.post("/uploadchatimage", isauthenticated,upload.single('chatimage'), uploadchatimage);
messageroutes.post("/markasread", isauthenticated, markasread);
messageroutes.get("/unread", isauthenticated, unreadmessages);
messageroutes.post("/deletemessages",isauthenticated,deleteMessage);
export default messageroutes;

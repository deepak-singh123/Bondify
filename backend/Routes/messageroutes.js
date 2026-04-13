import express from "express";
import { isauthenticated } from "../middlware/isAuthenticated.js";
import { getMessages, markasread, sendmessage, unreadmessages, uploadchatimage } from "../controllers/messages.js";
import upload from "../middlware/multer.js";

const messageroutes = express.Router();
messageroutes.post("/send/:id", isauthenticated, sendmessage);
messageroutes.get("/getmessages/:id", isauthenticated, getMessages);
messageroutes.post("/uploadchatimage", upload.single('chatimage'), isauthenticated, uploadchatimage);
messageroutes.post("/markasread", isauthenticated, markasread);
messageroutes.get("/unread", isauthenticated, unreadmessages);
export default messageroutes;

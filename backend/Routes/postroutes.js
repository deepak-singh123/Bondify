import express from "express";
import { isauthenticated } from "../middlware/isAuthenticated.js";
import upload from "../middlware/multer.js";
import uploadpost from "../controllers/uploadpost.js";
import { allposts, deletepost } from "../controllers/allposts.js";
import { likepost } from "../controllers/postlike.js";
import { getcomments, postcomment } from "../controllers/postcomment.js";

const postroutes = express.Router();
postroutes.post("/create", isauthenticated,upload.single('postimage'),  uploadpost);
postroutes.post("/delete/:id", isauthenticated, deletepost);
postroutes.get("/allposts", isauthenticated, allposts);
postroutes.post("/likepost/:id", isauthenticated, likepost);
postroutes.post("/comment/:id",  isauthenticated,upload.none(), postcomment);
postroutes.get("/getcomments/:id", isauthenticated, getcomments);
export default postroutes;

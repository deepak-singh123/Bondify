import express from "express" 
import { isauthenticated } from "../middlware/isAuthenticated.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors"
import upload from "../middlware/multer.js";
import uploadpost from "../controllers/uploadpost.js";
import { allposts, deletepost} from "../controllers/allposts.js";
import { likepost } from "../controllers/postlike.js";
import { getcomments, postcomment } from "../controllers/postcomment.js";

const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
dotenv.config()
app.use(cors()); 
const postroutes =  express.Router();

postroutes.post("/create",upload.single('postimage'),isauthenticated,uploadpost);
postroutes.post("/delete/:id",isauthenticated,deletepost);
postroutes.get("/allposts",isauthenticated,allposts);
postroutes.post("/likepost/:id",isauthenticated,likepost);
postroutes.post("/comment/:id",upload.none(),isauthenticated,postcomment);
postroutes.get("/getcomments/:id",isauthenticated,getcomments);
export default postroutes

import express from "express" 
import { registeruser } from "../controllers/authregister.js";
import { userlogin } from "../controllers/authlogin.js";
import { isauthenticated } from "../middlware/isAuthenticated.js";
import { authlogout } from "../controllers/authlogout.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors"

const app = express();
app.use(cookieParser());
app.use(express.json())
dotenv.config()

app.use(cors({ origin: "localhost:3000", credentials: true })); 

const router =  express.Router();
router.post("/register",registeruser);
router.post("/login",userlogin);
router.post("/logout",isauthenticated,authlogout);
export default router;
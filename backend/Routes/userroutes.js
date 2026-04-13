import express from "express";
import { isauthenticated } from "../middlware/isAuthenticated.js";
import allusers from "../controllers/allusers.js";
import userdata, { userviews } from "../controllers/userdata.js";

const userroutes = express.Router();
userroutes.get("/allusers", isauthenticated, allusers);
userroutes.get("/:id/info", isauthenticated, userdata);
userroutes.post("/views/:id", isauthenticated, userviews);
export default userroutes;

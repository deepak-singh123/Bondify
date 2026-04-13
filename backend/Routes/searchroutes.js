import express from "express";
import { isauthenticated } from "../middlware/isAuthenticated.js";
import searchuser from "../controllers/searchcontroller.js";

const searchroutes = express.Router();
searchroutes.get("/search", isauthenticated, searchuser);
export default searchroutes;

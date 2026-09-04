import express from "express";
import  {health}  from "../controllers/health.js";

const wakeuproute=express.Router()
wakeuproute.get("/", health);
export default wakeuproute;
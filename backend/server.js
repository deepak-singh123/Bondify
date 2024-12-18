import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import cors from "cors";
import authroutes from "./Routes/authroutes.js";
import userroutes from "./Routes/userroutes.js";
import postroutes from "./Routes/postroutes.js";
import followroutes from "./Routes/followRoutes.js";
import searchroutes from "./Routes/searchroutes.js";
import { createServer } from "http"; // Use HTTP for the server
import { Server } from "socket.io"; // Import Socket.IO

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static('public'));

/* Routes */
app.use('/auth', authroutes);
app.use('/user', userroutes); 
app.use('/user/post', postroutes); 
app.use('/user/connections', followroutes); 
app.use('/user', searchroutes); 

// Cloudinary setup
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true,
});

// Database connection
mongoose.connect(process.env.MONGO_URL, {
    dbName: "Bondify",
}).then(() => console.log("Database connected"))
  .catch((e) => console.log("Database connection error:", e));

// HTTP Server setup
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // Allow requests from your frontend
        credentials: true,
    },
});

// Online users tracker
const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log(`A user connected with id ${socket.id}`);

    // User is online
    socket.on("user_online", (userId) => {
        onlineUsers.set(userId, socket.id); // Map userId to socketId
        console.log(`User ${userId} is online.`);
    });

    // User sends a message
    socket.on("send_message", (data) => {
        const { senderId, receiverId, content } = data;

        const receiverSocketId = onlineUsers.get(receiverId); // Check if the receiver is online
        if (receiverSocketId) {
            // Deliver the message in real time
            io.to(receiverSocketId).emit("receive_message", {
                senderId,
                content,
                timestamp: new Date(),
            });
            console.log(`Message sent to user ${receiverId}`);
        } else {
            console.log(`User ${receiverId} is offline. Message will be saved.`);
            // Here you can implement logic to save the message to the database
        }
    });

    // User disconnects
    socket.on("disconnect", () => {
        const disconnectedUser = [...onlineUsers.entries()].find(([_, value]) => value === socket.id);
        if (disconnectedUser) {
            onlineUsers.delete(disconnectedUser[0]); // Remove the user from the online list
            console.log(`User ${disconnectedUser[0]} disconnected.`);
        }
    });
});

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
    console.log(`Server is active on port ${PORT}`);
});

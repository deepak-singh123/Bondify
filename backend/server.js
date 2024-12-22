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
import messageroutes from "./Routes/messageroutes.js";
import { Message } from "./models/message.js";
import { type } from "os";

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
app.use('/messages',messageroutes);
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
        io.emit("online_users", [...onlineUsers.keys()]);

    });
    // User sends a message

    socket.on("send_image",async(data)=>{
        try {
            const { senderId, receiverId, content, createdAt ,by} = data;
            console.log("Uploading image...");
            
            // Upload to Cloudinary
          
            if (content) {
            
                const receiverSocketId = onlineUsers.get(receiverId);
    
    
                // Emit to receiver if they are online
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_image", {
                        sender:senderId,
                        receiver:receiverId,
                        content: content,
                        type: "image",
                        by:"friend",
                        createdAt,
                    });
                }
    
                // Save the message to the database
                await Message.create({
                    sender: senderId,
                    receiver: receiverId,
                    content: content,
                    type: "image",
                    isRead: false,
                    
                });
    
                console.log("Image message saved to the database.");
            }
        } catch (error) {
            console.error("Error during image upload or message handling:", error);
        }
        
    })

    socket.on("send_message", async (data) => {
        console.log(data);
        const { senderId, receiverId, content ,type,createdAt,by} = data;

        const receiverSocketId = onlineUsers.get(receiverId); // Check if the receiver is online
        console.log("reciever id= ",receiverSocketId);
        if (receiverSocketId) {
            
            io.to(receiverSocketId).emit("receive_message", {
                sender:senderId,
                receiver:receiverId,
                content,
                createdAt,
                type,
                by:"friend"
               
            });
            console.log(`Message sent to user ${receiverId}`);
            
        } 
           
            // Here you can implement logic to save the message to the database
            const newmessage = await Message.create({
                sender: senderId,
                receiver: receiverId,
                content: content.trim(),
                isRead: false,
                
                
            });

            if (!newmessage) {
                console.error("Failed to save message to database");
                return;
            }
            console.log("Message saved to database:", newmessage);
        
    });

    // User disconnects
    socket.on("disconnect", () => {
        const disconnectedUser = [...onlineUsers.entries()].find(([_, value]) => value === socket.id);
        if (disconnectedUser) {
            onlineUsers.delete(disconnectedUser[0]); // Remove the user from the online list
            console.log(`User ${disconnectedUser[0]} disconnected.`);
            io.emit("online_users", [...onlineUsers.keys()]);
        }
    });



    socket.on("reconnect", () => {
        console.log(`Socket reconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
    console.log(`Server is active on port ${PORT}`);
});

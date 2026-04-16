/* eslint-disable no-undef */
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

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "https://bondifyy.netlify.app"],
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
        origin: ["http://localhost:5173", "https://bondifyy.netlify.app","https://bondify-ten.vercel.app"],
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
    /**********Alternative***************** */
   /* socket.on("user_online", (userId) => {
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        });
        onlineUsers.set(userId, socket.id);
        io.emit("online_users", [...onlineUsers.keys()]);
    });*/
    
    // User sends a message

    socket.on("send_image",async(data)=>{
        try {
            const { id,senderId, receiverId, content, createdAt ,by,public_id} = data;
            console.log("Uploading image...");
            
            // Upload to Cloudinary
          
            if (content) {
            
                const receiverSocketId = onlineUsers.get(receiverId);
    
    
                // Emit to receiver if they are online
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_image", {
                        id:id,
                        sender:senderId,
                        receiver:receiverId,
                        content: content,
                        type: "image",
                        by:"friend",
                        public_id:public_id,
                        createdAt,
                    });

                //Instantly sending event that a new unreadmessage is recieved
                 io.to(receiverSocketId).emit("new_message_notification",{senderId:senderId})
                }
              
                // Save the message to the database
                await Message.create({
                    sender: senderId,
                    receiver: receiverId,
                    content: content,
                    type: "image",
                    isRead: false,
                    public_id:public_id,
                    
                    
                });
    
                console.log("Image message saved to the database.");
            }
        } catch (error) {
            console.error("Error during image upload or message handling:", error);
        }
        
    })

    socket.on("send_message", async (data) => {
        console.log(data);
        const { senderId, receiverId, content, type, createdAt, by } = data;

        const receiverSocketId = onlineUsers.get(receiverId);
        console.log("reciever id= ", receiverSocketId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive_message", {
                sender: senderId,
                receiver: receiverId,
                content,
                createdAt,
                type,
                by: "friend",
            });
           

             //Instantly sending event that a new unreadmessage is recieved
            io.to(receiverSocketId).emit("new_message_notification",{senderId:senderId})

            
            console.log(`Message sent to user ${receiverId}`);
        }

        // Save exactly once, regardless of whether receiver is online
        try {
            const newmessage = await Message.create({
                sender: senderId,
                receiver: receiverId,
                content: content.trim(),
                isRead: false,
            });
            console.log("Message saved to database:", newmessage);
        } catch (err) {
            console.error("Failed to save message to database:", err);
        }
    });

    socket.on("message_seen", data=>{
        const { senderId, receiverId } = data;
        const receiverSocketId = onlineUsers.get(receiverId); // Check if the receiver is online
        console.log("inside the server message seen");
        if (receiverSocketId) {
            console.log("RECIEVER ONLINE");
            io.to(receiverSocketId).emit("message_response", {
                sender:senderId,
                receiver:receiverId,
                seen:true
            });
        }
    })


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

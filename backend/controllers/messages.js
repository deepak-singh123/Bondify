import { Message } from "../models/message.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises';

export const getMessages = async (req, res) => {
    try {
        const senderId = req.user._id; // Sender ID from authenticated user
        const receiverId = req.params.id; // Receiver ID from route parameter

        // Find all messages between the sender and receiver (both directions)
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation time (oldest to newest)

        if (!messages || messages.length === 0) {
            return res.status(204).json({ error: "No messages found between these users." });
        }

        return res.status(200).json(messages);
    } catch (err) {
        console.error("Error getting messages:", err);
        return res.status(500).json({ error: "An error occurred while retrieving messages." });
    }
};


export const sendmessage = async (req, res) => {
    try {
        const senderId = req.user._id; 
        const receiverId = req.params.id;
        const { content } = req.body;

        // Validate message content
        if (!content || content.trim() === "") {
            return res.status(400).json({ error: "Message content cannot be empty." });
        }

        // Create the message
        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            content: content.trim(),
            isRead: false,
        });

        // Respond with success and message details
        return res.status(200).json({
            message: "Message sent successfully.",
            data: {
                id: message._id,
                sender: message.sender,
                receiver: message.receiver,
                content: message.content,
                isRead: message.isRead,
                timestamp: message.createdAt,
            },
        });
    } catch (err) {
        console.error("Error sending message:", err);
        return res.status(500).json({ error: "An error occurred while sending the message." });
    }
};






export const uploadchatimage = async (req, res) => {
if(!req.file ){
    return res.status(400).json({ message: 'No file uploaded' });
}

try{
const result =   
await cloudinary.v2.uploader.upload(req.file.path, {
    folder: 'Bondify/Chat-Images',
    resource_type: 'image',
    public_id: `chat-image-${Date.now()}`,
    overwrite: true,
});

await fs.unlink(req.file.path).catch((err) =>
  console.error('Failed to delete file:', err)
);

return res.status(200).json({ message: 'File uploaded successfully',content:result.secure_url});
}
catch(err){
    console.log(err);
    if (req.file?.path) {
        await fs.unlink(req.file.path).catch((err) =>
          console.error('Failed to delete file:', err)
        );
    }
    return res.status(500).json({ message: 'Error uploading file', error: err.message });
}
}


export const markasread =  async (req, res) => {
    console.log("inside mark as read");
    const { senderId, receiverId } = req.body;

    try {
        await Message.updateMany(
            { sender: senderId, receiver: receiverId, isRead: false },
            { $set: { isRead: true } }
        );
        return res.status(200).json({ message: 'Messages marked as read.' });
    } catch (error) {
        return res.status(500).json({ error: 'Error updating messages.' });
    }
}

export const unreadmessages = async (req,res)=>{
        const  userId = req.user._id;

        try {
            // Total unread messages for the user
            const totalUnread = await Message.countDocuments({
                receiver: userId,
                isRead: false
            });
    
            // Unread messages grouped by friends
           

          const unreadByFriend = await Message.aggregate([
                { $match: { receiver: userId, isRead: false } },
                { $group: { _id: '$sender', count: { $sum: 1 } } },
                { $project: { _id: 1, count: 1 } }
                
                
            ])
    
            return res.status(200).json({ totalUnread ,unreadByFriend});
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching unread messages.' });
        }
 
    
}

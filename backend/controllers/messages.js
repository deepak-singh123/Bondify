import { Message } from "../models/message.js";

export const getMessages = async (req, res) => {
    try {
        console.log("inside getmessage");
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
            return res.status(404).json({ error: "No messages found between these users." });
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




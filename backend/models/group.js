const groupSchema = new mongoose.Schema({
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user" 
    }],
    lastMessage: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Message" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

export const group = mongoose.model("group", groupSchema);

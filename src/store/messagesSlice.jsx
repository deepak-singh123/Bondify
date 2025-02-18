import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const fetchmessages = createAsyncThunk(
    "messages/fetchmessages",
    async ({id,curruser}) => {
        try {
            // Access the current user
           
            const response = await fetch(`https://bondify-1lzw.onrender.com/messages/getmessages/${id}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch messages");

            const messages = await response.json();
       
            const processedMessages = messages.map((message) => ({
                id: message.id,
                by: message.sender == curruser._id ? "self" : "friend",
                content: message.content,
                isRead: message.isRead,
                createdAt: message.createdAt,
                type:message.type
            }));

            return processedMessages;
        } catch (err) {
            console.error("Error fetching messages:", err);
            throw err;
        }
    }
);

const messagesSlice = createSlice({
    name: "messages",
    initialState: [],
    reducers: {
        addmessage: (state, action) => {
            // Add the new message without spreading the current state
            state.push(action.payload);
        },
        
          clearMessages: () => {
            return [];
          },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchmessages.fulfilled, (state, action) => {
            return action.payload; // Replace the state with the fetched messages
        });
    },
});

export const { addmessage, clearMessages } = messagesSlice.actions;
export { fetchmessages };
export default messagesSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const fetchmessages = createAsyncThunk(
    "messages/fetchmessages",
    async ({id,curruser}) => {
        try {
            // Access the current user
            const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

            const response = await fetch(`/messages/getmessages/${id}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch messages");

            const text = await response.text();

const messages = text ? JSON.parse(text) : [];
       
            const processedMessages = messages.map((message) => ({
                id: message._id,
                by: message.sender == curruser._id ? "self" : "friend",
                content: message.content,
                isRead: message.isRead,
                createdAt: message.createdAt,
                type:message.type,
                public_id:message.public_id
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
           markMessagesRead: (state) => {
            state.forEach((msg) => {
                if (msg.by === "self") {
                    msg.isRead = true;
                }
            });
        },

        deletemessages:(state,action)=>{
          const  messeges_to_delete = action.payload

          return state.filter((msg)=>!messeges_to_delete.includes(msg.id))
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchmessages.fulfilled, (state, action) => {
            return action.payload; // Replace the state with the fetched messages
        });
    },
});

export const { addmessage, clearMessages , markMessagesRead ,deletemessages} = messagesSlice.actions;
export { fetchmessages };
export default messagesSlice.reducer;

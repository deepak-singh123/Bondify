import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const fetchmessages = createAsyncThunk(
    "messages/fetchmessages",
    async (id, { getState }) => {
        try {
            // Access the current user
            const currentUser = getState().user.user;

            const response = await fetch(`/messages/getmessages/${id}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch messages");

            const messages = await response.json();

            const processedMessages = messages.data.map((message) => ({
                id: message.id,
                by: message.sender === currentUser.id ? "self" : "friend",
                content: message.content,
                isRead: message.isRead,
                timestamp: message.timestamp,
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
            state.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchmessages.fulfilled, (state, action) => {
            return action.payload; // Replace the state with the fetched messages
        });
    },
});

export const { addmessage } = messagesSlice.actions;
export { fetchmessages };
export default messagesSlice.reducer;

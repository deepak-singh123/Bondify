import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk for fetching unread message counts
const fetchunreadcount = createAsyncThunk(
    'messagecount/fetchunreadcount',
    async () => {
        try {
            const response = await fetch(`https://bondify-1lzw.onrender.com/messages/unread`, {
                method: "GET",
                credentials: 'include',
            });
            if (!response.ok) throw new Error("Failed to fetch unread messages");
            return response.json(); // Ensure JSON response is returned
        } catch (err) {
            console.error(err);
            throw err; // Rethrow the error to trigger rejected state
        }
    }
);

const messagecountSlice = createSlice({
    name: 'messagecount',
    initialState: {
        totalmessagecount: null, // Holds the total count of unread messages
        unreadcounts: [],       // Holds counts grouped by friends
    },
    reducers: {
        settotalcount: (state, action) => {
            state.totalmessagecount = action.payload;
        },
        setunreadcount: (state, action) => {
            state.unreadcounts = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchunreadcount.fulfilled, (state, action) => {
                if (action.payload) {
                    state.totalmessagecount = action.payload.totalUnread;
                    state.unreadcounts = action.payload.unreadByFriend; 
                }
            })
            .addCase(fetchunreadcount.rejected, (state) => {
                state.totalmessagecount = null;
                state.unreadcounts = [];
            });
    },
});

// Export actions and async thunk
export const { settotalcount, setunreadcount } = messagecountSlice.actions;
export { fetchunreadcount };
export default messagecountSlice.reducer;

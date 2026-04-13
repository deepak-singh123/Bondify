import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MdOutlineQueryBuilder } from "react-icons/md";






export const fetchcomments = createAsyncThunk(
    'comment/fetchcomments',
    async(id)=>{
        try{
            const response = await fetch(`/user/post/getcomments/${id}`,{
                method:"GET",
                credentials: 'include',
                headers: {'Content-Type': 'application/json'}
            });
            if(!response.ok)throw new Error("Failed to fetch comments");
            return response.json();
        }
        catch(err){
            console.log(err);
        }
    }
)




const commentSlice = createSlice({
    name: 'comment',
    initialState: {
        comments: [],
    },
    reducers: {
        setComment: (state, action) => {
            state.comments.push(action.payload);
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchcomments.fulfilled,(state,action)=>{
            state.comments = action.payload;
        })
        .addCase(fetchcomments.rejected,(state)=>{
            state.comments = [];
        })
    }
})

export const { setComment } = commentSlice.actions;
export default commentSlice.reducer;
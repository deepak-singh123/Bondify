import { createSlice } from "@reduxjs/toolkit"


const pathSlice = createSlice({
name:'path',
initialState:{
    currentPath: window.location.pathname
},
reducers: {
    setPath: (state, action) => {
      state.currentPath = action.payload;
    }
  }
})
export const { setPath } = pathSlice.actions;
export default pathSlice.reducer;
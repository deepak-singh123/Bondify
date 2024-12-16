import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  curruserposts: [],
  connectionposts: [],
  allusersposts: [],
  loading: false,
  error: null,
  hasMore: {} // Indicates if more posts are available for each category
};

export const fetchuserposts = createAsyncThunk(
  "userpost/fetchuserposts",
  async (args, { rejectWithValue }) => {
    const { lastCreatedAt = null, limit = 5 } = args || {}; // Add fallback for args
    try {
      const response = await fetch(
        `/user/post/allposts?lastCreatedAt=${lastCreatedAt}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        console.error("Fetch error:", errorMessage);
        return rejectWithValue(errorMessage);
      }

      const data = await response.json();
      console.log("Fetch user posts response:", data); // Log the response for debugging
      return data; // { userposts, connectionpost, alluserspost, hasMore }
    } catch (error) {
      console.error(`Error fetching user posts with args:`, args, error);
      return rejectWithValue(`Failed to fetch posts: ${error.message}`);
    }
  }
);

const userpostSlice = createSlice({
  name: "userposts",
  initialState,
  reducers: {
    adduserpost: (state, action) => {
      state.curruserposts = action.payload;
    },
    removeuserpost: (state) => {
      state.curruserposts = [];
    },
    addconnectionpost: (state, action) => {
      state.connectionposts = action.payload;
    },
    removeconnectionpost: (state) => {
      state.connectionposts = [];
    },
    addalluserspost: (state, action) => {
      state.allusersposts = action.payload;
    },
    removealluserspost: (state) => {
      state.allusersposts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchuserposts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchuserposts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // Avoid duplicates by checking _id
        state.curruserposts = [
          ...state.curruserposts,
          ...action.payload.userposts.filter(
            (post) =>
              !state.curruserposts.some((existingPost) => existingPost._id === post._id)
          ),
        ];
        state.connectionposts = [
          ...state.connectionposts,
          ...action.payload.connectionpost.filter(
            (post) =>
              !state.connectionposts.some((existingPost) => existingPost._id === post._id)
          ),
        ];
        state.allusersposts = [
          ...state.allusersposts,
          ...action.payload.alluserspost.filter(
            (post) =>
              !state.allusersposts.some((existingPost) => existingPost._id === post._id)
          ),
        ];
        state.hasMore = {
          ...state.hasMore,
          ...action.payload.hasMore,
        };
      })
      .addCase(fetchuserposts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  adduserpost,
  removeuserpost,
  addconnectionpost,
  removeconnectionpost,
  addalluserspost,
  removealluserspost,
} = userpostSlice.actions;

export default userpostSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSearchResults = createAsyncThunk(
    'search/fetchResults',
    async (query) => {
        try{
            if(query.trim().length > 1){
        const response = await fetch(`https://bondify-1lzw.onrender.com/user/search?q=${query}`,{
            method:"GET",
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        }); 
        return response.json();
    }
    }
    catch(err){
        console.log(err);
    }
}
);

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        results: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchResults.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setResults, setLoading, setError } = searchSlice.actions;
export default searchSlice.reducer;
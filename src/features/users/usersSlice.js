import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

// We’ve managed to get content for posts from the JSONplaceholder API, but so far the authors are listed as “Unknown author.” Let’s fix that and also retrieve the authors from the same API using a thunk function.

const initialState = [];

// Then, it works pretty much the same way we used the thunk function to retrieve the posts.
// Now, to dispatch this thunk-function we'll do that a little different way, as we did with fetchPosts thunk. We'll go to the root index.js ->.
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(USERS_URL);
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  // We only need one case here, and we'll return the complete payload by rewriting this slice state with its data. Without using push it also means, that we're not going to accidentally add in the users twice.
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectAllUsers = (state) => state.users;

export default usersSlice.reducer;
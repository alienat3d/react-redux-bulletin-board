import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

const initialState = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(USERS_URL);
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectAllUsers = (state) => state.users;

// 1.0 We'll create another selector to select a user by ID. This selector function retrieves the state and the user ID. Then, we'll use the "find" method on the users array, which returns the user if ID matches.
export const selectUserById = (state, userId) => state.users.find(user => user.id === userId);
// (Go to [src/features/users/UserPage.js])

export default usersSlice.reducer;
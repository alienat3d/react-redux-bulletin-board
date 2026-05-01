import {createSlice} from "@reduxjs/toolkit";

// We'll also have a separate slice for managing users data so that we can select the author of a post in this app. So when the posts are made we want to go ahead and add the user id to the post.

const initialState = [
  {id: "0", name: "Dude Lebowski"},
  {id: "1", name: "Neil Young"},
  {id: "2", name: "Dave Gray"},
];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export const selectAllUsers = (state) => state.users;

export default usersSlice.reducer;
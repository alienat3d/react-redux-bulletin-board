import {createSlice, nanoid} from "@reduxjs/toolkit";
import {sub} from "date-fns";

const initialState = [
  {
    id: "1",
    title: "Learning Redux Toolkit",
    content: "I've heard good things.",
    date: sub(new Date(), {minutes: 10}).toISOString(), // We're using the "date-fns" library here, and its "sub" method subtracts 10 minutes from the current time and converting it to a timestamp string with "toISOString".
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
      cry: 0,
      laugh: 0,
      rolling: 0,
    },
  },
  {
    id: "2",
    title: "Slices...",
    content: "The more I say slice, the more I want pizza.",
    date: sub(new Date(), {minutes: 5}).toISOString(),
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
      cry: 0,
      laugh: 0,
      rolling: 0,
    },
  },
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // To add a post, we create a "postAdded" which will receive "state" and "action" with the payload (the text of the post). The payload will then be sent to the state. The 'createSlice' method in RTK uses another library, called 'immer', to manage immutability. So we can use the usual JS 'push' method, which is usually mutates an array it's been used on.
    postAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      // Instead of creating a new post object in the AddPostForm component, there is a better way to prepare the data. We can do this in the special "prepare" callback of the reducer in the slice like this:
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(), // Takes the current time in milliseconds and converts into a timestamp
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
              cry: 0,
              laugh: 0,
              rolling: 0,
            },
          },
        };
      },
    },
    reactionAdded(state, action) {
      const {postId, reaction} = action.payload;
      const existingPost = state.find(post => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
});

// To make life easier, it's a good idea to create a selector inside the slice for this part of the store. This way, if something changes in our structure, we only need to change the path to it here. This avoids having to search everywhere in the app and change it.
export const selectAllPosts = (state) => state.posts;

// Redux Toolkit creates actions automatically out of props names in reducers, so we just extract the names of them and import further to use elsewhere in our app
export const {postAdded, reactionAdded} = postsSlice.actions;

export default postsSlice.reducer;
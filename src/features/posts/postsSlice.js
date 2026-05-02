import {createAsyncThunk, createSlice, nanoid} from "@reduxjs/toolkit";
import axios from "axios";
import {sub} from "date-fns";

// We'll get data from a special fake API server service that emulates how a regular server API works.
const POSTS_URL = "https://jsonplaceholder.typicode.com/posts/";

// Redux does everything synchronously, so anything asynchronous has to happen outside the store. And this is where Redux middleware comes in and the most common async middleware is Redux thunk. Thunk is a recommended approach for writing async logic with Redux.
// ? A word "thunk" means as a programming term — "a piece of code that does some delayed work".

// The "createAsyncThunk" method of the Redux Toolkit accepts two arguments: 1) a prefix for the action type; 2) a payback creator callback. It returns either a promise with data or a rejected promise with an error. We use the axios library helper to request data from the URL and return it for processing.
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});

// Let's create another async thunk-function to change the way how we add a new post. We'll put "initialPost" inside the callback as a thunk argument, which will be a post body request that we send with axios and then we return the response data.
export const addNewPost = createAsyncThunk("posts/addNewPost", async (initialPost) => {
  const response = await axios.post(POSTS_URL, initialPost);
  return response.data;
});

// Let's rewrite the initialState, as previously it was static, but now we're going to receive it from an API server. So now "posts" is empty array, as we haven't hydrated. There will be a status property that indicates the current status of the request to the API server. This property is initially set to 'idle', but can also be set to other values (see the comment below). And we also have a prop 'error' to hold an error if we receive one.
const initialState = {
  posts: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // To add a post, we create a "postAdded" which will receive "state" and "action" with the payload (the text of the post). The payload will then be sent to the state. The 'createSlice' method in RTK uses another library, called 'immer', to manage immutability. So we can use the usual JS 'push' method, which is usually mutates an array it's been used on.
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload);
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
    // This function-reducer takes `state` and `payload` as arguments. It then extracts the name and ID of the emoji reaction from the payload and increments
    reactionAdded(state, action) {
      const {postId, reaction} = action.payload;
      const existingPost = state.posts.find(post => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  // Sometimes a slice reducer needs to respond to other actions that weren't defined as part of the slice's reducers and that is kind of like what happens with async thunks. So we'll need to add an extraReducers function that is supported. It receives "a builder" parameter, and it's an object that lets us define additional case reducers that run in response to the actions defined outside the slice. So we're adding with special builder's method 'addCase' the cases are listening for the Promise status action types that are dispatched by the fetch posts thunk and then we respond by setting our state accordingly.
  extraReducers(builder) {
    builder
      // if Promise 'pending' then we'll set status to 'loading'
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      // if Promise 'fulfilled' then we'll set status to 'succeeded' but we're also return some data here.
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Adding date and reactions
        // As the fake API we're using here doesn't have a couple of the areas of data that we need. We'll set one minute and then map over an array with the posts, that we get from 'action.payload'.
        let min = 1;
        const loadedPosts = action.payload.map(post => {
          // We'll set the date with method 'sub' from library 'date-fns', what we're using and increasing the minutes for each post and in that way they won't have the same timestamp.
          post.date = sub(new Date(), {minutes: min++}).toISOString();
          // We also have reactions those aren't coming from the API either, so we just needed to add those here and then we return that post.
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
            cry: 0,
            laugh: 0,
            rolling: 0,
          };
          return post;
        });

        // Add any fetched posts to the array
        // We'll add those loaded posts to our state with method 'concat'. Now let's realize it's still inside the slice, which uses 'immer' library underneath the hood. So we can run methods like 'concat', that we wouldn't normally do, because it would mutate the state, but inside of method 'createSlice' with 'immer' lib that is how we do it and 'immer' handles it stays immutable.
        state.posts = state.posts.concat(loadedPosts);
      })
      // Of course, we should also change the status of the "rejected" possibility here and write an error message to the state when we received it.
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // We also need a case for "addNewPost," which receives and saves the user ID to the store, generates a date, and adds reactions with a count of zero to each one manually. Then, we'll push everything to the payload object ("immer" will ensure that it remains an immutable operation).
      .addCase(addNewPost.fulfilled, (state, action) => {
        // Fix for API post IDs:
        // Creating sortedPosts & assigning the id
        // would be not be needed if the fake API
        // returned accurate new post IDs
        const sortedPosts = state.posts.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
        // End fix for fake API post IDs

        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
          cry: 0,
          laugh: 0,
          rolling: 0,
        };
        console.log(action.payload);
        state.posts.push(action.payload);
      });
  },
});

// To make life easier, it's a good idea to create a selector inside the slice for this part of the store. This way, if something changes in our structure, we only need to change the path to it here. This avoids having to search everywhere in the app and change it.
export const selectAllPosts = (state) => state.posts.posts;
// We'll need some more of selectors here for the status and for an error.
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

// Redux Toolkit creates actions automatically out of props names in reducers, so we just extract the names of them and import further to use elsewhere in our app
export const {postAdded, reactionAdded} = postsSlice.actions;

export default postsSlice.reducer;
import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {sub} from "date-fns";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts/";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});

export const addNewPost = createAsyncThunk("posts/addNewPost", async (initialPost) => {
  const response = await axios.post(POSTS_URL, initialPost);
  return response.data;
});

export const updatePost = createAsyncThunk("posts/updatePost", async (initialPost) => {
  const {id} = initialPost;
  try {
    const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
    return response.data;
  } catch (err) {
    // return err.message;
    return initialPost; // only for testing Redux! (otherwise «JSONplaceholder» won't let us update the post we just added, but normally you won't do that way)
  }
});

export const deletePost = createAsyncThunk("posts/deletePost", async (initialPost) => {
  const {id} = initialPost;
  try {
    const response = await axios.delete(`${POSTS_URL}/${id}`);
    if (response?.status === 200) return initialPost;
    return `${response?.status}: ${response?.statusText}`;
  } catch (err) {
    return err.message;
  }
});

// 1.3.0 We have to add one small feature before we can apply optimizations: a simple counter that doesn't really serve a purpose in the blog but will be useful for demonstrating some optimizations and implementing a new state with Redux. ↓
const initialState = {
  posts: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // ? 1.4 And we're not using the "postAdded" anymore since we've applied an Async Thunk. So we can eliminate that.
    /*postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
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
    },*/
    reactionAdded(state, action) {
      const {postId, reaction} = action.payload;
      const existingPost = state.posts.find(post => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    // 1.5.0 We'll add another reducer here for a counter. ↓
    increaseCount(state) {
      state.count += 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        const loadedPosts = action.payload.map(post => {
          post.date = sub(new Date(), {minutes: min++}).toISOString();
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
        state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        const sortedPosts = state.posts.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
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
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        const {id} = action.payload;
        action.payload.date = new Date().toISOString();
        const posts = state.posts.filter(post => post.id !== id);
        state.posts = [...posts, action.payload];
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
        const {id} = action.payload;
        state.posts = state.posts.filter(post => post.id !== id);
      });
  },
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
// 1.5.1 Then we'll need a selector, that gets that count from a counter.
// (Go to [src/components/Header.js])
export const getCount = (state) => state.posts.count;

export const {increaseCount, reactionAdded} = postsSlice.actions;

export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId);
// 1.7.2 So we'll add another special selector here "selectByUser" using "createSelector" method, which accepts one or more input functions and notice they are inside of array, which can be a clue that they're dependencies (or better said the values are returned from those functions are dependencies). And they provide the input parameters for the output function of our memoized selector. So if "selectAllPosts" value changes or the argument of anonymous arrow func changes (here it's userId only as the func just returns "userId") essentially that's the only time tha we'll get something new from this selector and that's the only time it will rerun. So it's memoized.
// (Go to [src/features/users/UserPage.js])
export const selectPostsByUser = createSelector([selectAllPosts, (state, userId) => userId], (posts, userId) => posts.filter(post => post.userId === userId));

export default postsSlice.reducer;
import {createAsyncThunk, createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {sub} from "date-fns";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts/";

// 1.9.3 Let's create that entity adaptor here. Then we'll put a "sortComparer" func inside the "createEntityAdapter". ↓
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

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
/*const initialState = {
  posts: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0,
};*/
// 1.9.4 Now, we'll change the way we form initialState, we'll do this through "postsAdapter.getInitialState" and without the "posts" empty array. We don't need to create it as adapter will create an array with IDs and an object with entities, which are objects of values connected to those IDs. Yet we're still have to add an extra states on top of that. ↓
const initialState = postsAdapter.getInitialState({
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0,
});

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
    // 1.9.5 Now, as we're using adapter, we have to change this reducer a little bit to work with it. Now we can simply pass and ID of the post into "entities" object to look up the post. ↓
    reactionAdded(state, action) {
      const {postId, reaction} = action.payload;
      // const existingPost = state.posts.find(post => post.id === postId);
      const existingPost = state.entities[postId];
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
        // 1.9.6 We also can change this as adapter has its own CRUD-methods. ↓
        // state.posts = state.posts.concat(loadedPosts);
        postsAdapter.upsertMany(state, loadedPosts);
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
        // 1.9.7 Next one we'll change is a push method replacing it with "addOne". ↓
        // state.posts.push(action.payload);
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        // const {id} = action.payload;
        action.payload.date = new Date().toISOString();
        // 1.9.8 Next is this one can be replaced with "upsertOne" adapter's method. ↓
        // const posts = state.posts.filter(post => post.id !== id);
        // state.posts = [...posts, action.payload];
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
        const {id} = action.payload;
        // 1.9.9 The last one here is this one replaced by adapter's "removeOne". ↓
        // state.posts = state.posts.filter(post => post.id !== id);
        postsAdapter.removeOne(state, id);
      });
  },
});

// 1.9.10 Now we'll be replacing some of the selectors because getSelectors is another method we're going to call that automatically creates some selectors that we would typically need.
// ? 1.9.11 "getSelectors" creates these selectors, and we rename them with aliases using destructuring, and we also pass in a state selector into "getSelectors" as argument to choose, which part of store we're going to use:
// (Go to [src/features/posts/PostsList.js])
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts);

// export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
// 1.5.1 Then we'll need a selector, that gets that count from a counter.
// (Go to [src/components/Header.js])
export const getCount = (state) => state.posts.count;

export const {increaseCount, reactionAdded} = postsSlice.actions;

// export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId);

// 1.7.2 So we'll add another special selector here "selectByUser" using "createSelector" method, which accepts one or more input functions and notice they are inside of array, which can be a clue that they're dependencies (or better said the values are returned from those functions are dependencies). And they provide the input parameters for the output function of our memoized selector. So if "selectAllPosts" value changes or the argument of anonymous arrow func changes (here it's userId only as the func just returns "userId") essentially that's the only time tha we'll get something new from this selector and that's the only time it will rerun. So it's memoized.
// (Go to [src/features/users/UserPage.js])
export const selectPostsByUser = createSelector([selectAllPosts, (state, userId) => userId], (posts, userId) => posts.filter(post => post.userId === userId));

export default postsSlice.reducer;
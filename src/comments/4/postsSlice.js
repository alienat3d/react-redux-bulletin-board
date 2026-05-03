import {createAsyncThunk, createSlice, nanoid} from "@reduxjs/toolkit";
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

// 3.11.0 We have to add a thunk function for our new EditPostForm component to make changes to the store. We'll send in the initial post data. Then we destructuring and getting an ID from an initialPost, because we need to pass the ID in URL as we send this update to the API. We'll use HTTP-method "PUT" with "axios". And of course we're sending along that post data, as we're now putting data to update the existing post that has whatever ID that we pass into this URL. ↓
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

// 3.14.0 It's time to work on the delete post feature. We'll create another Thunk function for that. We've done something similar before, but this time it's a bit different. We'll still receive an initial post data and still destructuring post ID. But this time we'll use axios method "delete" and HTTP-method "DELETE".
export const deletePost = createAsyncThunk("posts/deletePost", async (initialPost) => {
  const {id} = initialPost;
  try {
    const response = await axios.delete(`${POSTS_URL}/${id}`);
    // 3.14.1 Now we see something here that is almost unique to our fake API that we're using from «JSONplaceholder» because even though we send the delete request API doesn't send back the ID (typically API will send back the ID of the post we've just deleted). So turn around this we'll check if response status '200' and if so we'll return the initialPost data, so we can grab the ID out of it, inside our builder case as we move down here in the postsSlice.
    if (response?.status === 200) return initialPost;
    // 3.14.2 But if it doesn't have a status of 200 then we're returning as message that has whatever status and status text there is, so that at least be logged if we didn't get correct info that we expected that says our post is deleted and this is essentially passing that ID along. ↓
    return `${response?.status}: ${response?.statusText}`;
  } catch (err) {
    return err.message;
  }
});

const initialState = {
  posts: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
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
    },
    reactionAdded(state, action) {
      const {postId, reaction} = action.payload;
      const existingPost = state.posts.find(post => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
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
      // 3.11.1 And as we already know, async thunks should be handled with extraReducers. And it's slightly different to what we had before. We're getting some info back here with the action payload, but we could have a successful post essentially a post that is not rejected as a Promise, but it might not have a status "200" and it might not have completed the update. Say the server sends a status code "500" of an error. So we're going to check if payload has the ID property, and we're checking it with the optional chaining here with «?.». Then we'll log "Update could not complete" to console and then return the error message from a catch block of axios, so that's why it's "console.log(action.payload)" here too. But it still not be considered an error it would be considered fulfilled because axios still return that information. So what happens is we get our error message right here, and then we just return to in this.
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        // 3.11.2 If everything goes as planned we can destructure the ID from the action payload and we'll set a new date on the action payload.
        const {id} = action.payload;
        action.payload.date = new Date().toISOString();
        // 3.11.3 Then we'll go ahead and filter out the previous post with the same ID, and then we can update our state with all previous posts and then of course pass in the new post.
        // (Go to [src/features/posts/EditPostForm.js])
        const posts = state.posts.filter(post => post.id !== id);
        state.posts = [...posts, action.payload];
      })
      // 3.14.3 Surely, we'll need to add this deletePost thunk also into an extraReducers case. We're looking for 'fulfilled' response in the deletePost Promise and that is pretty much like it was in the "updatePost" — we're checking if we have that "id" prop with an optional chaining. And if it doesn't exist for any reason, then we're logging in the console "Delete could not complete" along together with the error from "axios" with "console.log(action.payload)".
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
        // 3.14.4 Otherwise we're destructuring post ID and filtering out all the other posts that are not equal to that ID. Then we're just setting the state to those posts because we've essentially deleted that post, and so we don't want it in the state any longer.
        // (Go to [src/features/posts/EditPostForm.js])
        const {id} = action.payload;
        state.posts = state.posts.filter(post => post.id !== id);
      });
  },
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const {postAdded, reactionAdded} = postsSlice.actions;

// 3.0 Let's transform our project into a multipage application, where each post will have its own page to show the entire post (not just an excerpt of that post as it's on the list of the posts page), defined by its own ID. For that purpose, we'll create a new selector here, that receives not only the state but a post id. And we're finding a specific post by its ID with a usual "find" JS-method comparing ID from argument with IDs in the items inside of posts array.
// (Go to [src/features/posts/SinglePostPage.js])
export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId);

export default postsSlice.reducer;
import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice";
// import axios from "axios";
import {sub} from "date-fns";

// const POSTS_URL = "https://jsonplaceholder.typicode.com/posts/";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

// 8.2.0 Now we need to make a few changes to “postsSlice” here; to start with, we can remove the “Thunk functions” here.
/*export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
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
});*/

// 8.2.1 We can empty out the initialState here as well.
/*const initialState = postsAdapter.getInitialState({
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0,
});*/
const initialState = postsAdapter.getInitialState();

// 8.2.2 And we're get rid of the "createSlice" altogether even though we're in this postsSlice.js file we'll still use that name because we're extending the apiSlice.js to handle that. So we'll use the imported apiSlice here and use a "injectEndpoints" method here and that's where we put our endpoints now.
/*const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const {postId, reaction} = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
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
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
        const {id} = action.payload;
        postsAdapter.removeOne(state, id);
      });
  },
});*/
export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // 8.3.0 So lets breakdown our new method here "getPosts" that's going to get all the posts. We have a builder's method "query" and we've a query function that returns "/posts" which is attached to that baseUrl that we provided in apiSlice.js and that is issuing HTTP-request "GET" to get all posts from DB.
    getPosts: builder.query({
      query: () => "/posts",
      // 8.3.1 Then we're using "transformResponse" for a couple of reasons — First purpose is that the data that we've in DB doesn't have the date or the reactions attached to it.
      transformResponse: responseData => {
        // 8.3.2 We'll define a minute so we can increment that and use it for each post, and by that they won't have an exact same time.
        let min = 1;
        // 8.3.3 Then we'll use method "map" on responseData, so we're creating a new posts array we'll be able to use.
        const loadedPosts = responseData.map(post => {
          // 8.3.4 Then we'll be saying if the post doesn't already have date data then set the post.date to this new date and each post's date shall be incremented by one minute so they're all one minute apart.
          if (!post?.date) post.date = sub(new Date(), {minutes: min++}).toISOString();
          // 8.3.5 Same for reactions — if post doesn't have reactions then will be setting the reactions all to zero as it first comes in.
          if (!post?.reactions) post.reactions = {
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
        // 8.3.6 The second purpose of transformResponse that we need to use as we're using RTK Query with the EntityAdapter is to go ahead and normalize our state so we need to send this new state to the posts adapter, and we do that with "setAll" and then we pass in the "initialState" together with "loadedPosts". As we know from the previous lesson a normalized data will have an array of IDs and also an object "entities" and then we can use that array with IDs as an object lookup with the entities when we refer to each post.
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      // 8.3.7 Here "providesTags" is a little more complex than we saw in the previous "ToDo app" example in previous lesson. Here it is an array defined and as the first entry of it we're identifying as "LIST" and type "Post" as all of these will be. That means we're identifying the list and any time that we invalidate one of these tags it will re-perform or re-auto-fetch essentially all the posts again. So if we want to get the full list we can just invalidate the list ID. But what we're also doing now is providing an object for each separate individual post passing the ID from the post we're doing that by mapping over the result but we're also spreading it into individual post IDs here. So what we end up with type "Post" and "id" for each post. If any one of those post IDs are invalidated it will also refetch our list automatically because it is invalidated and that's what providesTags does. ↓
      providesTags: (result, error, arg) => [
        {type: "Post", id: "LIST"},
        ...result.ids.map(id => ({type: "Post", id})),
      ],
    }),
    // 8.11.0 Let's continue adding methods in this slice and the next one will be "getPostsByUserId" that's just a little different. Now we've a query that's receiving an argument so we set it with the parameter definition of "id" and this is going to request posts, and then it's going to have the user ID attached to this request. So that will give us the posts from a specific user by his ID.
    getPostsByUserId: builder.query({
      query: id => `/posts/?userId=${id}`,
      // 8.11.1 We're using "transformResponse" just as we did above in "getPosts" in the exact concept because we still need to add this info to the posts if it doesn't exist.
      transformResponse: responseData => {
        let min = 1;
        const loadedPosts = responseData.map(post => {
          if (!post?.date) post.date = sub(new Date(), {minutes: min++}).toISOString();
          if (!post?.reactions) post.reactions = {
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
        // 8.11.2 And we're again using a postsAdapter, and it's method "setAll". Now this is not overwrite the cache state of the request for the full list of posts because Redux is subscribing to these different queries which we'll be able to see when we complete if we use Redux Devtools. As now this will have a cache state for this specific query as well. And again with the postsAdapter we're normalizing this state so it will also be normalized with an "ids" array and then having each post inside the entities object.
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      // 8.11.3 Much like with "getPosts" above we're not giving an ID of the full list, but we're spreading the result that's ran through the map here and using here "ids" array. And we have type "Post" and the "id" inside of that, so we can invalidate this query for anyone of these queries and anyone of the users because we'd be looking at the individual posts. So if anyone of those posts were invalidated in the future it could know to invalidate this cache and re-run this query by auto-fetching essentially. ↓
      providesTags: (result, error, arg) => [
        ...result.ids.map(id => ({type: "Post", id})),
      ],
    }),
    // 8.12.0 So next method "addNewPost" will be not a query, but mutation (any methods, those are adding, updating or deleting will be mutations).
    addNewPost: builder.mutation({
      // 8.12.1 Here we'll be passing in a post, and it'll be posting to that "/posts" URL by HTTP-method "POST".
      query: initialPost => ({
        url: "/posts",
        method: "POST",
        // 8.12.2 Then as a request body we'll be spreading in the post object, and then we're overriding the userId, making sure it's a number and not a string as we post it, we'll be adjusting the date and set in the reactions. ↓
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
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
      }),
      // 8.12.3 What's very different to queries is that in mutations we're using "invalidatesTags" instead of "providesTags". This going to invalidate the list. There's no individual post because this post didn't already exist, but it'll be part of the list, so it should invalidate the post list cache.
      invalidatesTags: [
        {type: "Post", id: "LIST"},
      ],
    }),
    // 8.13.0 Okay, next method is "updatePost" and it's a mutation as well. Since it's an update we'll be getting "id" property from that "initialPost" object. Here will be used a "PUT"-method.
    updatePost: builder.mutation({
      query: initialPost => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        // 8.13.1 We also will be spreading "initialPost" here and then updating the date with a new one. Everything else is already exist because it was already a pre-existing post, so we don't need to worry adding here in addition.
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      // 8.13.2 This is going to invalidate tags as well it's going to invalidate whichever post id was there. So instead of just result here we'll use the "argument" because the argument was that initialPost, so we can write here "arg.id" just like "initialPost.id"
      invalidatesTags: (result, error, arg) => [
        {type: "Post", id: arg.id},
      ],
    }),
    // 8.14.0 Let's add the "deletePost" as well. It's much the same now — we're not getting the full post as the argument, so the param will be just "id" and we'll destructure it from the post. Then we'll pass in that "id" to the "url" and will be using HTTP-method "DELETE" here. Also, we're providing that "id" in the body of the request.
    deletePost: builder.mutation({
      query: ({id}) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: {id},
      }),
      // 8.14.1 Pretty much as with "updatePost" we'll have invalidatesTags where we use that argument that will be that object, and we're not destructuring anything just refer to it's prop "id". ↓
      invalidatesTags: (result, error, arg) => [
        {type: "Post", id: arg.id},
      ],
    }),
    // 8.20.0 Let's add another method here so that users could add a new reaction if they want to. It'll be, once again, a builder mutation, but we don't want to reload our list every time we add a reaction. So we're going to do that differently, we'll use so-called "optimistic update". Let's break down this method: First, we have a query here that is going to receive a post id and reactions object. Notice we're destructuring it from an object being sent in. Then we've a url, which uses a post ID in it. HTTP-method is going to be "PATCH" and in "body" we'll pass all the reactions for the post, as we're going to replace the existing reactions with the reactions that passed in.
    addReaction: builder.mutation({
      query: ({postId, reactions}) => ({
        url: `posts/${postId}`,
        method: "PATCH",
        // ? In a real app, we'd probably need to base this on user ID somehow, so that a user can't do the same reaction more than once.
        body: {reactions},
      }),
      // 8.20.1 Then we've here a "onQueryStarted" handler where we, once again, passing in a post id and reactions, just like we did above with the query, but then it has a second parameter as well. This second param has dispatch and "queryFulfilled", which is a Promise, so we're going to look at that to know the status as well.
      async onQueryStarted({postId, reactions}, {dispatch, queryFulfilled}) {
        // 8.20.2 We're using dispatch func to dispatch "extendedApiSlice" and refer to it's "util" object to get "updateQueryData" method. And we'll pass in the endpoint "getPosts". "undefined" here stays for the cache key argument, but all we really need here is an endpoint. And "draft" stays for the draft of our data. Then we'll get the specific post from that draft using our an object lookup with "ids" array.
        // ? `updateQueryData` requires the endpoint name and cache key arguments, so it knows which piece of cache state to update.
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData("getPosts", undefined, draft => {
            // ? The `draft` is Immer-wrapped and can be "mutated" like in createSlice.
            const post = draft.entities[postId];
            // 8.20.3 Then if the post exist we'll set in the reactions to the reactions we passed in to this builder mutation (normally this will be a mutation operation, but "immer" library takes care about it).
            if (post) post.reactions = reactions;
          }),
        );
        // 8.20.4 Then after all that we'll be waiting for the Promise to fulfill, otherwise if it will catch error we'll undo this patch.
        // ? 8.20.5 That is because, as we said before it's "an optimistic update" and what we're really doing in that "patchResult" here is updating cache and that's happening optimistically possibly before the data at the API has been updated. So we're instantly seeing that in UI what happens if we click on the reaction, and it instantly updates and after then the network request go to the API to update that data. So it will match what we already see in UI, but if it fails for any reason then it will undo what we've changed inside of cache of our data as well. That's why we're using a Promise "queryFulfilled", so if it doesn't fulfill we can undo that.
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      // ? 8.20.6 We aren't using the "invalidateTags" method because we don't want to re-fetch the list each time a reaction is added. Therefore, we aren't going to invalidate any posts or lists. What we are going to do is update the cache optimistically so that we don't have to make another request. However, we will also update the API data.
      // (Go to [src/features/posts/ReactionButtons.js])
    }),
  }),
});
// 8.4 Now, as we remember from a previous lesson to RTK Query, it generates hooks. So custom hooks already based on the methods created above. So it creates a "useGetPostsQuery" and we'll be able to use that in our "PostsList" component.
// 8.11.4 And then remember that each method we added above creates another custom hook, so let's export one for "getPostsByUserId" method as well here (as we know it shall start with "use" and ending with "Query"). ↑
// 8.15 With all the methods in place, we've to update selectors now too.
// (Go to [src/features/posts/AddPostForm.js])
export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

// 8.6.0 We'll create a couple of new selectors here: one returns the query result object. It doesn't issue the query it just returns the result object that we already have from the query. So this "selectPostsResult" selector will be equal "extendedApiSlice", that we defined above, then "endpoints" as it's an object, then "getPosts", as it's an object and then calling "select" method to get the result object. But that is the entire result object and not just a data.
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

// 8.6.1 Then we need to use "createSelector" method to create "selectPostsData". As we remember the "createSelector" method receives an input function or functions and then has an output function. We're passing in here an input function which is the "selectPostsResult" query and the output func is taking that result and then just looking at the data property. And that data property holds a normalized state object that has the IDs array and then the entities as well. ↓
const selectPostsData = createSelector(
  selectPostsResult,
  postsResult => postsResult.data, // normalized state object with IDs & entities
);

// 8.6.2 Now here, while we're keeping these selectors and renaming them we need to change how "getSelectors" method finds the state because that has changed. We're going to use the "selectPostsData" selector that we have above. Now it will select the "selectPostsData" with the state inside to say where the state is, and it returns the normalized state. However, it could be null especially the first time app loads so we want to use this coalescing operator here "??" that says "if what's on the left is null it's going to return what's on the right" and here it's the "initialState". So now with that change these selectors still be good.
// (Go to [src/app/store.js])
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
// } = postsAdapter.getSelectors(state => state.posts);
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState);

/* 8.5 We can get rid of all of that now. ↑
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

export const {increaseCount, reactionAdded} = postsSlice.actions;

export const selectPostsByUser = createSelector([selectAllPosts, (state, userId) => userId], (posts, userId) => posts.filter(post => post.userId === userId));

export default postsSlice.reducer;*/

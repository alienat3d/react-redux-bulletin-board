import {configureStore} from "@reduxjs/toolkit";
// import postsReducer from "../features/posts/postsSlice";
import usersReducer from "../features/users/usersSlice";
import {apiSlice} from "../features/api/apiSlice";

// 8.7.0 Now we no long have postsReducer, so it can be removed from here. But we'll add the apiSlice here instead. And this is going to be dynamically named but whatever name we put in that reducerPath (so far it's named "api" inside the apiSlice.js), but it could be named something else and that's why we want to make it dynamically named right here "[apiSlice.reducerPath]" and then it's computed.
export const store = configureStore({
  reducer: {
    // posts: postsReducer, users: usersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    users: usersReducer,
    // 8.7.1 We'll leave the usersReducer as it is right now but as we use RTK Query with the store there's some required middleware we must insert here as well. This is a middleware we're getting with method "getDefaultMiddleware" is a default Redux middleware we shall make sure to have here. This will be an array that's returned, and we'll use "concat" method on it to add "apiSlice.middleware" that we need, that was created by apiSlice. It does manage cache lifetimes and expirations, and it's required to use when we're using RTK Query and an apiSlice.
    // (Go to [src/index.js])
  },
  middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});
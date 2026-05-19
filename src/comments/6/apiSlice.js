import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ? 8.0 So, we started by switching from the “JSONplaceholder” service's dummy database to a database that closely resembles a real one—in the form of a JSON file stored locally within this project—and the “JSON-server” library will allow us to access it as if it were a server. Next, we'll create a special slice called “apiSlice” to send requests to the database (on the virtual server).
// ? 8.1.0 And this one looks a bit different from what we have seen in previous lesson "an intro to RTK Query", because we're not defining any endpoints, although we're passing a builder in here. We need to have this as it's required, but what we're going to do is create extended slices so we can separate our logic say from posts and users for our project. And the "reducerPath" is optional if we name it 'api' (because it's default name), but if we want to name it something else — it's not optional anymore.
// ? 8.1.1 A "baseQuery" is like with "axios", where we define a base URL.
// ? 8.1.2 Also a tagTypes will be here "Post".
// (Go to [src/features/posts/postsSlice.js])
export const apiSlice = createApi({
    reducerPath: 'api', // optional
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
    tagTypes: ['Post', 'User'],
    endpoints: builder => ({})
})
import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./app/store";
// import {fetchPosts} from "./features/posts/postsSlice";
import {extendedApiSlice} from "./features/posts/postsSlice";
import {fetchUsers} from "./features/users/usersSlice";
import App from "./App";
import "./index.css";

// 8.8 We also have to make some changes here. We're no longer going to use "fetchPosts" as we already deleted that async thunk-function and in that place we'll import extendedApiSlice. Let's exchange the "fetchPosts" here with the proper path now. So we'll refer to an "endpoints" object and to that's method "getPosts" and call method "initiate" that gets the initial data. So we'll be still loading the posts data as the app starts up.
// (Go to [src/features/posts/PostsList.js])
// store.dispatch(fetchPosts());
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
store.dispatch(fetchUsers());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
      <Routes>
        <Route path="/*" element={<App/>}/>
      </Routes>
    </Router>
  </Provider>,
  // </React.StrictMode>,
);
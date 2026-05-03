import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./app/store";
import {fetchPosts} from "./features/posts/postsSlice";
import {fetchUsers} from "./features/users/usersSlice";
import App from "./App";
import "./index.css";

// 3.17.0 So, as we did already to our users, let's load also the posts in the beginning of loading our app. So when we come to the website with other URL than a homepage ("website.com/post/55" for example), then we won't get an error that it can't find that post as it didn't receive the data yet.
// (Go to [src/features/posts/PostsList.js])
store.dispatch(fetchPosts());
// As we want to load users right at the moment the app starts and for that we'll run here dispatch function with the thunk-function "fetchUsers".
store.dispatch(fetchUsers());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    {/* 3.2 To apply React Router to the project and make it a multipage application while still keeping it a single-page application (SPA), we'll wrap the main “App” component in the following structure: */}
    {/* (Go to [src/components/Layout.js]) */}
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
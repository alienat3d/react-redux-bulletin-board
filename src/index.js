import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./app/store";
import {fetchUsers} from "./features/users/usersSlice";
import App from "./App";
import "./index.css";

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
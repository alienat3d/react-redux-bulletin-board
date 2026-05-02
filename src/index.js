import React from "react";
import ReactDOM from "react-dom/client";
import {Provider} from "react-redux";
import {store} from "./app/store";
import {fetchUsers} from "./features/users/usersSlice";
import App from "./App";
import "./index.css";

// As we want to load users right at the moment the app starts and for that we'll run here dispatch function with the thunk-function "fetchUsers".
store.dispatch(fetchUsers());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
);
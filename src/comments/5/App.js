import {Route, Routes, Navigate} from "react-router-dom";
import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm";
import Layout from "./components/Layout";
import SinglePostPage from "./features/posts/SinglePostPage";
import EditPostForm from "./features/posts/EditPostForm";
import UsersList from "./features/users/UsersList";
import UserPage from "./features/users/UserPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>

        <Route index element={<PostsList/>}/>

        <Route path="post">
          <Route index element={<AddPostForm/>}/>
          <Route path=":postId" element={<SinglePostPage/>}/>
          <Route path="edit/:postId" element={<EditPostForm/>}/>
        </Route>

        {/* 1.2.0 We also need to add routes here for the users list page and the dynamically created individual user pages. */}
        <Route path="user">
          <Route index element={<UsersList/>}/>
          <Route path=":userId" element={<UserPage/>}/>
        </Route>

        {/* 1.2.1 Besides that, let's also add a redirect to the homepage using "Navigate" since we don't have a "404 Error" page. However, we could replace it with the "404 Error" component if needed. */}
        {/* ? 1.2.2 This 'catch-all' route essentially means 'direct it there if none of the above routes match the URL'. */}
        {/* ? 1.2.3 A "replace" attribute here means that's going to replace the bad request whatever that address or page was that didn't exist is going to replace that in history with the good address that we're sending the user to. */}
        {/* (Go to [src/features/posts/postsSlice.js]) */}
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Route>
    </Routes>
  );
}

export default App;

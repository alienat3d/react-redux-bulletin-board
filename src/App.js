import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm";
import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import SinglePostPage from "./features/posts/SinglePostPage";

// 3.4.0 Now let's apply routing from React Router here.
function App() {
  return (
    /*<main className="App">
      <AddPostForm/>
      <PostsList/>
    </main>*/
    <Routes>
      <Route path="/" element={<Layout/>}>

        {/* 3.4.1 "index" attribute here means it's a homepage element */}
        <Route index element={<PostsList/>}/>

        {/* 3.4.2 for path "website.com/post" we'll have nested two other routes and also one will be index-route and another dynamic path "website.com/post/(here will be a post's ID)" */}
        <Route path="post">
          <Route index element={<AddPostForm/>}/>
          {/* 3.4.3 ":" at path means it's a dynamically changing path */}
          {/* (Go to [src/features/posts/SinglePostPage.js]) */}
          <Route path=":postId" element={<SinglePostPage/>}/>
        </Route>

      </Route>
    </Routes>
  );
}

export default App;

import {useSelector} from "react-redux";
import {selectUserById} from "./usersSlice";
import {selectPostsByUser} from "../posts/postsSlice";
import {Link, useParams} from "react-router-dom";

// 1.1.0 This page is going to be able to display any given user that has their data passed in.
const UserPage = () => {
  // 1.1.1 We'll retrieve the user ID from the page's URL using the "useParams" hook and pass it to the "selectUserById" selector to retrieve the user's data from the usersSlice. We should also remember to convert it to a number, since we originally retrieve the ID as a string.
  const {userId} = useParams();
  const user = useSelector(state => selectUserById(state, Number(userId)));

  // 1.1.2 And we also have this "postsForUser", where we get all the posts, created by current user to display them on his individual page.
  // 1.7.0 So, we have a small optimization issue. When we click the counter button in the header, the entire list of users on the user page refreshes along with it. This is clearly not what we want, and we can optimize it so that the counter button operates independently and the list no longer refreshes (we can easily see that in React Devtools "Profiler" tab).
  /*  const postsForUser = useSelector(state => {
      // 1.7.1 Here we select all posts with selector and then return filtered posts by user ID. And this is where that issue occurs. Filter will return a new array every time and hook "useSelector" will run an action every time is dispatched. And each time we run that dispatch-func with "increaseCount" func inside in the header then this "useSelector" runs again and forces a component to rerender. If a new reference value is returned then we're returning a new value with a filter. And that's why user page rerenders. And we can fix all of these by creating a memoized selector.
      // (Go to [src/features/posts/postsSlice.js])
      const allPosts = selectAllPosts(state);
      return allPosts.filter(post => post.userId === userId);
    });*/
  // 1.7.3 Now we just replace the old "postsForUser" with a new memoized selector.
  // (Go to [src/features/posts/PostExcerpt.js])
  const postsForUser = useSelector(state => selectPostsByUser(state, Number(userId)));

  // 1.1.3 Then we will map through all of this user's posts and display their titles as list items on the page, each with a link to the current post. So we can go to a specific post for any given post, as they have their own individual post page already.
  // (Go to [src/App.js])
  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user?.name}</h2>

      <ol>{postTitles}</ol>
    </section>
  );
};

export default UserPage;
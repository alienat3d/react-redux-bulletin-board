import {useSelector} from "react-redux";
import {selectUserById} from "./usersSlice";
// import {selectPostsByUser} from "../posts/postsSlice";
import {Link, useParams} from "react-router-dom";
import {useGetPostsByUserIdQuery} from "../posts/postsSlice";

// 8.18.0 We also have to make some changes for this component. As we're getting posts by the user ID, so we can display them on the user page so that's what we're going to do here.
const UserPage = () => {
  const {userId} = useParams();
  const user = useSelector(state => selectUserById(state, Number(userId)));

  // 8.18.1 So we won't use this one anymore, as we will be getting that from the new hook "useGetPostsByUserIdQuery", we've in "postsSlice" and we destruct some stuff out of there. So we're pass in the "userId", that we get from "useParams" hook with React Router, which gives us an ID from page URL. Then we'll define the data we get from that hook as "postsForUsers" and we'll need different statuses, so we can conditionally render our components and an error (where will be an error message if there is one). ↓
  // const postsForUser = useSelector(state => selectPostsByUser(state, Number(userId)));
  const {data: postsForUsers, isLoading, isSuccess, isError, error} = useGetPostsByUserIdQuery(userId);

  // 8.18.2 So, let's use all of that now. First we'll replace this logic, where we were mapping posts to create a list of links to the posts.
  /*const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));*/
  // 8.18.3 So let's break it down: We create a "content" variable and then start checking through different statuses of progress we have. If it's loading then we'll show just a word "Loading...".
  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    // 8.18.4 If it's "isSuccess", which means the data is ready to render. But remember we've now a normalized state, so our "postsForUsers" that we receive has the "ids" array and the "entities" object that has all the individual posts for the user. We'll destructuring that right here and mapping over the "ids" array and for each "id" we'll create a list item and a link to the post. But when we get to the content, and we need the title we've to use the entities object as a "lookup object" so we pass in the "id" and it will give us a specific post. And then we reference to its title.
    const {ids, entities} = postsForUsers;
    content = ids.map(id => (
      <li key={id}>
        <Link to={`/post/${id}`}>{entities[id].title}</Link>
      </li>
    ));
    // 8.18.5 And if it's an error (isError is true), then we'll be printing an error.
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>{user?.name}</h2>

      {/* 8.18.6 Now we have it named "content", so let's replace that too. */}
      {/* (Go to [src/components/Header.js]) */}
      {/*<ol>{postTitles}</ol>*/}
      <ol>{content}</ol>
    </section>
  );
};

export default UserPage;
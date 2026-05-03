import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchPosts, getPostsError, getPostsStatus, selectAllPosts} from "./postsSlice";
import PostExcerpt from "./PostExcerpt";
// Those are been move to PostsExcept component:
// import PostAuthor from "./PostAuthor";
// import TimeAgo from "./TimeAgo";
// import ReactionButtons from "./ReactionButtons";

const PostsList = () => {
  // We'll need to import the dispatch function here
  const dispatch = useDispatch();

  // Getting all posts from Redux store with a selector selectAllPosts
  const posts = useSelector(selectAllPosts);

  // And also add both other selectors for status & error
  const status = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  // Inside the "useEffect" React-hook we'll check the value of status and if it's "idle" we'll dispatch a "fetchPosts" async thunk function. In the dependencies of "useEffect" hook we have "status" & "dispatch".
  // Now we want to display the loading state in our post list, and we're going to start by extracting some of the post list component into a separate component called "PostExcerpt"
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  // Here, we will create a content container that will be filled in based on the current status value. If the status value is "loading," the page should display "Loading..." If the data is received successfully, we'll sort the posts, map over them using the PostExcerpt component, and create a list of posts. If we receive an error from the server API, we will display an error message.
  let content;
  if (status === "loading") {
    content = <p>"Loading..."</p>;
  } else if (status === "succeeded") {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map(post => <PostExcerpt key={post.id} post={post}/>);
  } else if (status === "failed") {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};
export default PostsList;
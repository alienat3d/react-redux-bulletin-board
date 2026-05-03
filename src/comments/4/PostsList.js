// 3.17.1 And then we can get rid of "useEffect", "useDispatch" hooks and "fetchPosts" thunk-func here.
// import {useEffect} from "react";
import {useSelector} from "react-redux";
import {getPostsError, getPostsStatus, selectAllPosts} from "./postsSlice";
import PostExcerpt from "./PostExcerpt";

const PostsList = () => {
  // const dispatch = useDispatch();

  const posts = useSelector(selectAllPosts);
  const status = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

/*  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);*/

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
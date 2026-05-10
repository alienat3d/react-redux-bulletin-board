import {useSelector} from "react-redux";
// 1.10.0 We'll modify quite a bit this component to take advantage of the benefits of implementing an adapter for postsSlice.
// import {getPostsError, getPostsStatus, selectAllPosts} from "./postsSlice";
import {getPostsError, getPostsStatus, selectPostIds} from "./postsSlice";
import PostExcerpt from "./PostExcerpt";

const PostsList = () => {
  // 1.10.1 And here.
  // const posts = useSelector(selectAllPosts);
  const orderedPostIds = useSelector(selectPostIds);
  const status = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  let content;
  if (status === "loading") {
    content = <p>"Loading..."</p>;
  } else if (status === "succeeded") {
    // 1.10.2 And in this block, as we run the sort function already inside an adapter.
    // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
    // 1.10.3 And we'll set the content just a little bit differently because we're using the ordered post IDs and map over that and pass in post ID.
    // content = orderedPosts.map(post => <PostExcerpt key={post.id} post={post}/>);
    // (Go to [src/features/posts/PostExcerpt.js])
    content = orderedPostIds.map(postId => <PostExcerpt key={postId} postId={postId}/>);
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
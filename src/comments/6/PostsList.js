import {useSelector} from "react-redux";
// import {getPostsError, getPostsStatus, selectPostIds} from "./postsSlice";
import {selectPostIds} from "./postsSlice";
import {useGetPostsQuery} from "./postsSlice";
import PostExcerpt from "./PostExcerpt";

// 8.9.0 Here we'll use the "useGetPostsQuery" custom hook that was generated from method "getPosts" inside [postsSlice.js] where we've the extendedApiSlice. And we'll destructure that hook here to extract several things here to use in several places below.
const PostsList = () => {
  const {isLoading, isSuccess, isError, error} = useGetPostsQuery();

  const orderedPostIds = useSelector(selectPostIds);
  // 8.9.1 Some of those we're not using anymore so it can be deleted.
  // const status = useSelector(getPostsStatus);
  // const error = useSelector(getPostsError);

  let content;
  // 8.9.2 We'll replace some things here according to what we extracted from the hook above.
  // (Go to [src/features/posts/PostAuthor.js])
  // if (status === "loading") {
  if (isLoading) {
    content = <p>"Loading..."</p>;
  // } else if (status === "succeeded") {
  } else if (isSuccess) {
    content = orderedPostIds.map(postId => <PostExcerpt key={postId} postId={postId}/>);
  // } else if (status === "failed") {
  } else if (isError) {
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
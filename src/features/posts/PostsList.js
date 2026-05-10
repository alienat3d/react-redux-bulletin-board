import {useSelector} from "react-redux";
import {getPostsError, getPostsStatus, selectPostIds} from "./postsSlice";
import PostExcerpt from "./PostExcerpt";

const PostsList = () => {
  const orderedPostIds = useSelector(selectPostIds);
  const status = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  let content;
  if (status === "loading") {
    content = <p>"Loading..."</p>;
  } else if (status === "succeeded") {
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
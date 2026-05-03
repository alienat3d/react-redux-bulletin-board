// 3.1 This component will let user see the full post. And it will look a lot like PostExcerpt component, but we won't need to restrict the content part of it with just 100 letters here.
// (Go to [src/index.js])
import {useParams} from "react-router-dom";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectPostById} from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

const SinglePostPage = () => {
  // 3.5.0 To retrieve a postId from URL we'll use "useParams" hook from React Router.
  const {postId} = useParams();

  // 3.5.1 And we'll select our selector and pass the post ID into it, but before converting it into a number, so that we can compare it later in our check inside postsSlice.
  // (Go to [src/features/posts/PostExcerpt.js])
  const post = useSelector((state) => selectPostById(state, Number(postId)));

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p className="postCredit">
        <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
        <PostAuthor userId={post.userId}/>
        <TimeAgo timestamp={post.date}/>
      </p>
      <ReactionButtons post={post}/>
    </article>
  );
};

export default SinglePostPage;
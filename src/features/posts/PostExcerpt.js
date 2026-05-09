import {Link} from "react-router-dom";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

// 1.8.0 Okay, we’ve fixed the issue with the User List not updating when we click the counter button, but we still have a similar optimization problem on the posts page. The issue is that when we click on an emoji, all the posts in the list are re-rendered. This causes a significant memory leak, so we need to fix that as well.

const PostExcerpt = ({post}) => {
  return (
    <article>
      <h2>{post.title}</h2>
      <p className="excerpt">{post.body.substring(0, 75)}...</p>
      <p className="postCredit">
        <Link to={`/post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId}/>
        <TimeAgo timestamp={post.date}/>
      </p>
      <ReactionButtons post={post}/>
    </article>
  );
};

export default PostExcerpt;
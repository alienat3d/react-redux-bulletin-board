import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import {Link} from "react-router-dom";

const PostExcerpt = ({post}) => {
  return (
    <article>
      <h2>{post.title}</h2>
      <p className="excerpt">{post.body.substring(0, 75)}...</p>
      <p className="postCredit">
        {/* 3.6 Here we'll use Link to create a React Router link to the page of post's full view. */}
        {/* (Go to [src/components/Header.js]) */}
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId}/>
        <TimeAgo timestamp={post.date}/>
      </p>
      <ReactionButtons post={post}/>
    </article>
  );
};
export default PostExcerpt;
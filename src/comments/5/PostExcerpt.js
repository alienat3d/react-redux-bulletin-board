// import React from 'react';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectPostById} from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

// 1.8.0 Okay, we’ve fixed the issue with the User List not updating when we click the counter button, but we still have a similar optimization problem on the posts page. The issue is that when we click on an emoji, all the posts in the list are re-rendered. This causes a significant memory leak, so we need to fix that as well.
// 1.8.1 There is one quick way to fix that and is definitely legitimate and there's nothing wrong with doing it this way, however we'll look at full-featured solution after this also. Let's change this "const" to "let" at first.
// 1.11.0 Now it's not just getting "post", but "postId".
// const PostExcerpt = ({post}) => {
const PostExcerpt = ({postId}) => {
  // 1.11.1 Now here we also need to call the "selectPostById" selector.
  const post = useSelector(state => selectPostById(state, postId));

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

// 1.8.2 Here we'll set that equal to React.memo. And what it does is it allows this component to not re-render if the prop that it receives has not changed. So if the post doesn't change that's passed to PostExcerpt it will not re-render.
// PostExcerpt = React.memo(PostExcerpt);
// (Go to [src\comments\5\create-entity-adapter-api.md])

export default PostExcerpt;
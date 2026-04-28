import {useSelector} from "react-redux";
import {selectAllPosts} from "./postsSlice";
// import PostAuthor from "./PostAuthor";
// import TimeAgo from "./TimeAgo";
// import ReactionButtons from "./ReactionButtons";

const PostsList = () => {
  // Getting all posts from Redux store with a selector selectAllPosts
  const posts = useSelector(selectAllPosts);

  // Sorting the posts by their dates
  const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));

  // The Render Posts function takes the posts array from the Redux store and creates an article element for each post, filling it in with the data taken from the store for each post.
  const renderedPosts = orderedPosts.map(post => (
    <article key={post.id}>
      <h3>{post.title}</h3>
      {/* If post is long, we'll limit the preview to 100 letters */}
      <p>{post.content.substring(0, 100)}</p>
      <p className="postCredit">
        {/*<PostAuthor userId={post.userId}/>*/}
        {/*<TimeAgo timestamp={post.date}/>*/}
      </p>
      {/*<ReactionButtons post={post}/>*/}
    </article>
  ));

  return (
    <section>
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
export default PostsList;
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectAllUsers} from "../users/usersSlice";

// 8.10 Let's make here also a small fix that actually has nothing to do with RTK Query, but we're still not using a Link on an author's name.
// (Go to [src/features/posts/postsSlice.js])
const PostAuthor = ({userId}) => {
  const users = useSelector(selectAllUsers);

  const author = users.find(user => user.id === userId);

  return <span className="post-author">by <strong>{author ?
    <Link to={`/user/${userId}`}>{author.name}</Link> :
    "Unknown author"
  }</strong></span>;
};

export default PostAuthor;
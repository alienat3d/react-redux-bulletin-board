import {useSelector} from "react-redux";
import {selectAllUsers} from "../users/usersSlice";

// This component receives a user's ID as an argument through the "useSelector" hook and the "selectAllUsers" selector in usersSlice.js. It receives an array with all users, sorts out the user with the ID in the argument, and returns the name of the selected user to sign the posted item.
const PostAuthor = ({userId}) => {
  const users = useSelector(selectAllUsers);

  const author = users.find(user => user.id === userId);

  return <span className="post-author">by <strong>{author ? author.name : "Unknown author"}</strong></span>;
};
export default PostAuthor;
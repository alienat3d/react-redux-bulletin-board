import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {addNewPost} from "./postsSlice";
import {selectAllUsers} from "../users/usersSlice";

const AddPostForm = () => {
  const dispatch = useDispatch();

  // 3.16.0 We'll add navigate here as well, ... ↓
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const users = useSelector(selectAllUsers);

  const onTitleChanged = (evt) => setTitle(evt.target.value);
  const onContentChanged = (evt) => setContent(evt.target.value);
  const onAuthorChanged = (evt) => setUserId(evt.target.value);

  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");

        dispatch(addNewPost({title, body: content, userId})).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        // 3.16.1 ... we want to bring user back to homepage, as we do by deleting post feature already.
        // (Go to [src/index.js])
        navigate("/");
      } catch (err) {
        console.error("Failed to save the post", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }

  };

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button
          type="button"
          onClick={onSavePostClicked}
          disabled={!canSave}
        >Save Post
        </button>
      </form>
    </section>
  );
};
export default AddPostForm;
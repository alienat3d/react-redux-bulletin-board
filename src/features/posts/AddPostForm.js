import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {postAdded} from "./postsSlice";
import {selectAllUsers} from "../users/usersSlice";

const AddPostForm = () => {
  const dispatch = useDispatch();

  // We're using here also local state with the React hook "useState" to make "controlled form inputs". We won't send this data to the global state, it is just for this component. We only want to send things to the global state that other components possibly use throughout the application.
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const users = useSelector(selectAllUsers);

  const onTitleChanged = (evt) => setTitle(evt.target.value);
  const onContentChanged = (evt) => setContent(evt.target.value);
  const onAuthorChanged = (evt) => setUserId(evt.target.value);

  // Function that will check if title and text of the post are exist and then save it to store together with the selected user's id with dispatch function any by calling the "postAdded" method. Then it clears the inputs.
  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postAdded(title, content, userId));
      setTitle("");
      setContent("");
    }
  };

  // Checking if the title, content, and user ID exist. Only in that case will we enable the "Send Form" button.
  const canSave = Boolean(title) && Boolean(content) && Boolean(userId);

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
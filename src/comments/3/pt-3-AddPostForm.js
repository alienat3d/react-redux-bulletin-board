import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {addNewPost, postAdded} from "./postsSlice";
import {selectAllUsers} from "../users/usersSlice";

const AddPostForm = () => {
  const dispatch = useDispatch();

  // We're using here also local state with the React hook "useState" to make "controlled form inputs". We won't send this data to the global state, it is just for this component. We only want to send things to the global state that other components possibly use throughout the application.
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  // Add additional local state for storing current status.
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const users = useSelector(selectAllUsers);

  const onTitleChanged = (evt) => setTitle(evt.target.value);
  const onContentChanged = (evt) => setContent(evt.target.value);
  const onAuthorChanged = (evt) => setUserId(evt.target.value);

  // Checking if the title, content, and user ID exist. Only in that case will we enable the "Send Form" button.
  // const canSave = Boolean(title) && Boolean(content) && Boolean(userId);
  // We'll refactor this checking a little bit to also take in account the requestStatus. We're still checking if title, conten & userId are exist (true), but putting them into an array and use "every" method with Boolean inside to check if they all return true. Plus we say that addRequestStatus should have value of "idle" to enable the "Add Post" button.
  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === "idle";

  // We also refactor the onSavePostClicked function:
  /*const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postAdded(title, content, userId));
      setTitle("");
      setContent("");
    }
  };*/
  const onSavePostClicked = () => {
    // Now we're checking the status before we go and use "try...catch...finally" construct
    if (canSave) {
      try {
        // Starting with setting request status to "pending" instead of "idle"
        setAddRequestStatus("pending");
        // We'll call a dispatch function that calls an "addNewPost" thunk function inside of it to add a new post. It'll receive a title, content as body and userId as well. Redux Toolkit adds "unwrap" func to the returned Promise and then that returns a new Promise that either has the action payload or it throws an error if it's the rejected action. So that lets us use this try-catch logic here, and it will throw an error if it is rejected.
        dispatch(addNewPost({title, body: content, userId})).unwrap();

        // Then we're just emptying out state as it was before after this process is complete.
        setTitle("");
        setContent("");
        setUserId("");
      } catch (err) {
        console.error("Failed to save the post", err);
      } finally {
        // No matter if there is an error or not we're setting request status back to "idle".
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
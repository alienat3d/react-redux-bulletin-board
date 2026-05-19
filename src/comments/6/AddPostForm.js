// import {useReducer, useState} from "react";
import {useState} from "react";
// import {useDispatch, useSelector} from "react-redux";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
// import {addNewPost} from "./postsSlice";
import {useAddNewPostMutation} from "./postsSlice";
import {selectAllUsers} from "../users/usersSlice";

const AddPostForm = () => {
  // 8.16.0 So we no longer need dispatch function here, but we'll bring "addNewPost" function with the "useAddNewPostMutation" hook we've just created in "postsSlice". We'll also need "isLoading" so we can use it here when create a content and use it conditionally.
  // const dispatch = useDispatch();
  const [addNewPost, {isLoading}] = useAddNewPostMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  // 8.16.1 We also won't use this "addRequestStatus". ↓
  // const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const users = useSelector(selectAllUsers);

  const onTitleChanged = (evt) => setTitle(evt.target.value);
  const onContentChanged = (evt) => setContent(evt.target.value);
  const onAuthorChanged = (evt) => setUserId(evt.target.value);

  // 8.16.4 And one more final change here is to replace that "addRequestStatus" with "isLoading" (or better say we need to check that isLoading is false and isn't loading).
  // (Go to [src/features/posts/EditPostForm.js])
  // const canSave = [title, content, userId].every(Boolean) && addRequestStatus === "idle";
  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        // 8.16.2 Let's also remove those "setAddRequestStatus" & "dispatch" uses from here as well. But we'll replace it with "addNewPost" we've imported from postsSlice which shall be asynchronous. And will pass in the post, that has the title, body with content and userId. We'll still use method "unwrap" because we're still in a "try...catch" block. ↓
        // setAddRequestStatus("pending");
        // dispatch(addNewPost({title, body: content, userId})).unwrap();
        await addNewPost({title, body: content, userId}).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate("/");
      } catch (err) {
        console.error("Failed to save the post", err);
      }
      // 8.16.3 Now we can also remove this "finally" block because we're no longer using "setAddRequestStatus". ↑
      /*finally {
        setAddRequestStatus("idle");
      }*/
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
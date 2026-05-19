import {useParams, useNavigate} from "react-router-dom";
import {useState} from "react";
// import {useDispatch, useSelector} from "react-redux";
import {useSelector} from "react-redux";
// import {selectPostById, updatePost, deletePost} from "./postsSlice";
import {selectPostById, useUpdatePostMutation, useDeletePostMutation} from "./postsSlice";
import {selectAllUsers} from "../users/usersSlice";

// 8.17.0 Here we'll need to make changes that are nearly identical to what we've done in previous "AddPostForm" component, except this component is going to be able to update and delete.
const EditPostForm = () => {
  const {postId} = useParams();
  const navigate = useNavigate();

  // 8.17.1 So, let's start with bringing two methods we need here "updatePost" & "deletePost" from postsSlice via the hooks. We'll also need "isLoading" here as well. ↓
  const [updatePost, {isLoading}] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const post = useSelector((state) => selectPostById(state, Number(postId)));
  const users = useSelector(selectAllUsers);

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.body);
  const [userId, setUserId] = useState(post?.userId);
  // 8.17.2 We can get rid of "requestStatus" state here too.
  // const [requestStatus, setRequestStatus] = useState("idle");

  // 8.17.3 No need of dispatch function here anymore. ↓
  // const dispatch = useDispatch();

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const onTitleChanged = evt => setTitle(evt.target.value);
  const onContentChanged = evt => setContent(evt.target.value);
  const onAuthorChanged = evt => setUserId(Number(evt.target.value));

  // 8.17.4 Same as we did before, let's replace this state with "isLoading" on this check.
  // const canSave = [title, content, userId].every(Boolean) && requestStatus === "idle";
  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        // 8.17.5 And we'll replace those two with async "updatePost" method here. And we'll pass in the post once again, that is being created and also using "unwrap", because we're inside the "try...catch" block. ↓
        // setRequestStatus("pending");
        // dispatch(updatePost({id: post.id, title, body: content, userId, reactions: post.reactions})).unwrap();
        await updatePost({id: post.id, title, body: content, userId}).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error("Failed to save the post", err);
      }
      // 8.17.6 We'll also remove this "finally" block too, as we're not using "setRequestStatus" anymore. ↓
      /*finally {
        setRequestStatus("idle");
      }*/
    }
  };

  const usersOptions = users.map(user => (
    <option
      key={user.id}
      value={user.id}
    >{user.name}</option>
  ));

  // 8.18.0 But we also have "deletePost" method that we need to implement here, let's go do that.
  const onDeletePostClicked = async () => {
    try {
      // 8.18.1 Those two are going away and will be replaced with "deletePost". Here we'll just pass in the "post.id" because that's all that needed to delete the post.
      // (Go to [src/features/users/UserPage.js])
      /*setRequestStatus("pending");
      dispatch(deletePost({id: post.id})).unwrap();*/
      await deletePost({id: post.id}).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the post", err);
    }
    /*finally {
      setRequestStatus("idle");
    }*/
  };

  return (
    <section>
      <h2>Edit Post</h2>
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
        >
          Save Post
        </button>
        <button className="deleteButton"
                type="button"
                onClick={onDeletePostClicked}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
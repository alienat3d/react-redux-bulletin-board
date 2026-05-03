import {useParams, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectPostById, updatePost, deletePost} from "./postsSlice";
import {selectAllUsers} from "../users/usersSlice";

// 3.10.0 Now, there will be a component that gives users the ability to edit posts as needed. This component will be a hybrid of the SinglePostPage and the AddPostForm components. It will have the logic of both components, but nothing new. We're also going to use local state for controlled inputs in the form.
const EditPostForm = () => {
  // 3.10.1 We'll use that "useParams" hook, as we need that post ID, just like we do with a single post page.
  const {postId} = useParams();
  // 3.10.2 We'll use hook "useNavigate", so we can use it later.
  const navigate = useNavigate();
  // 3.10.3 We're using selector to select specific post by its ID.
  const post = useSelector((state) => selectPostById(state, Number(postId)));
  // 3.10.4 And we use another selector to select all the users.
  const users = useSelector(selectAllUsers);

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.body);
  const [userId, setUserId] = useState(post?.userId);
  const [requestStatus, setRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  // 3.10.5 This check to see if there are any posts and the return of a piece of HTML must come after all hooks; otherwise, we will receive an error from React.
  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  // 3.10.6 Here we have the handlers for the form input changes for title, content and author.
  const onTitleChanged = evt => setTitle(evt.target.value);
  const onContentChanged = evt => setContent(evt.target.value);
  const onAuthorChanged = evt => setUserId(Number(evt.target.value));

  // 3.10.7 Similar to AddPostForm, we have a "canSave" check here that enables the "Save" button if all the terms are met.
  const canSave = [title, content, userId].every(Boolean) && requestStatus === "idle";

  // 3.10.8 However here it's a little bit different to AddPostForm, as we have more info in the post. When the post is first created we're pulling in info from fake API «JSONplaceholder». Then when we do that, and we add a new post to our state we're adding in the reactions and the date because they didn't previously exist at the API. But now when we're updating the post we need to include all the info we have except for the date, because we'll set a new date. Then we use method "unwrap", which throws an error and brings us to the error block "catch" if an error occurs. So it allows us to us "try...catch" logic.
  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setRequestStatus("pending");
        // 3.12 Here we'll dispatch our thunk func and passing in all the info it needs. Again, the only prop is won't be passed in is the date because we create a new one.
        // (Go to [src/App.js])
        dispatch(updatePost({id: post.id, title, body: content, userId, reactions: post.reactions})).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        // 3.10.9 Here is "navigate" we've created, which will bring user to the individual post page by its ID after it has been saved.
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error("Failed to save the post", err);
      } finally {
        setRequestStatus("idle");
      }
    }
  };

  // 3.10.10 Here we have to create a usersOptions to once again populate drop menu just like we create a new post, and it will have all the users names in there. So we could change the author if we want to.
  const usersOptions = users.map(user => (
    <option
      key={user.id}
      value={user.id}
    >{user.name}</option>
  ));

  // 3.15 "onDeletePostClicked" will be pretty much similar to "onSavePostClicked". We'll still set the request status to "pending" and then we dispatch thunk-function "deletePost", but this time sending only post id into it, as it's all this function need to remove the post from state. And we still use method "unwrap" to use "try...catch" logic. Still using "navigate" to bring user back to the homepage with the posts list after the post is deleted. And as we did to "onSavePostClicked" we log an error, if we get one. And then we set back request status to "idle" in the end no matter what happened before.
  // (Go to [src/features/posts/AddPostForm.js])
  const onDeletePostClicked = () => {
    try {
      setRequestStatus("pending");
      dispatch(deletePost({id: post.id})).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the post", err);
    } finally {
      setRequestStatus("idle");
    }
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
        {/*3.10.11 Then the form itself is pretty much like the form from AddPostForm component. The only change here is we had to provide "value" attribute with a user ID. That is because the edited post already has an author. So it makes sense to show who is the author of the post. */}
        {/* (Go to [src/features/posts/postsSlice.js]) */}
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
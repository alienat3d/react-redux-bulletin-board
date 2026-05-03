import {useDispatch} from "react-redux";
import {reactionAdded} from "./postsSlice";

// Here is a list of emoji buttons and their respective counters, which are passed to postsSlice by name and ID to be sent to the global state
const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
  cry: "😢",
  laugh: "😁",
  rolling: "🙄",
};

// Here it gets post as a prop
const ReactionButtons = ({post}) => {
  const dispatch = useDispatch();

  // We'll map over object with emojis with object's method "entries", where the name is a property name and emoji ist a value. And when each emoji button is clicked, we'll pass its ID and the reaction name to the dispatch function to be stored in the state.
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() => dispatch(reactionAdded({postId: post.id, reaction: name}))}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
export default ReactionButtons;
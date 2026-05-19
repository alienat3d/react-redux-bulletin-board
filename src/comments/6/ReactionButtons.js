// 8.21.0 So we can remove both of those here, as it's not needed anymore. But we'll import a "useAddReactionMutation" hook we've just created.
/*import {useDispatch} from "react-redux";
import {reactionAdded} from "./postsSlice";*/
import {useAddReactionMutation} from "./postsSlice";

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

const ReactionButtons = ({post}) => {
  // 8.21.1 We'll replace dispatch func with calling "useAddReactionMutation" hook and getting "addReaction" method from it.
  // const dispatch = useDispatch();
  const [addReaction] = useAddReactionMutation();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      // 8.21.2 We also need to modify the function within the "onClick" button listener. We'll define "newValue" by getting the post reaction name and incrementing it to give it a new value. Then, we'll use the "addReaction" method, passing in all the reactions. We'll also pass in the post ID and the object containing all the reactions. Finally, we'll replace the current reaction by name with "newValue".
      <button
        key={name}
        type="button"
        className="reactionButton"
        // onClick={() => dispatch(reactionAdded({postId: post.id, reaction: name}))}
        onClick={() => {
          const newValue = post.reactions[name] + 1;
          addReaction({postId: post.id, reactions: {...post.reactions, [name]: newValue}});
        }}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
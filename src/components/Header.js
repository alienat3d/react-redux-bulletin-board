import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getCount, increaseCount} from "../features/posts/postsSlice";

const Header = () => {
  // 1.6.0 Then here we'll need a dispatch function.
  const dispatch = useDispatch();

  // 1.6.1 And also a count, which we'll get via selector, that we just created.
  const count = useSelector(getCount);

  return (
    <header className="header">
      <h1>Redux Blog</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="post">Post</Link></li>
          <li><Link to="user">Users</Link></li>
        </ul>
        {/* 1.6.2 And we also add a button to a header, which will display the count of our counter feature. */}
        {/* (Go to [src/features/users/UserPage.js]) */}
        <button onClick={() => dispatch(increaseCount())}>{count}</button>
      </nav>
    </header>
  );
};

export default Header;
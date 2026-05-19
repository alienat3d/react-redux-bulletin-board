import {Link} from "react-router-dom";
// import {useDispatch, useSelector} from "react-redux";
// import {useDispatch} from "react-redux";
// import {getCount, increaseCount} from "../features/posts/postsSlice";

// 8.19 Actually we can remove that counter that we added here for the testing purpose earlier to the Header, when we worked on optimization.
// (Go to [src/features/posts/postsSlice.js])
const Header = () => {
  // const dispatch = useDispatch();
  // const count = useSelector(getCount);

  return (
    <header className="header">
      <h1>Redux Blog</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="post">Post</Link></li>
          <li><Link to="user">Users</Link></li>
        </ul>
        {/*<button onClick={() => dispatch(increaseCount())}>{count}</button>*/}
      </nav>
    </header>
  );
};

export default Header;
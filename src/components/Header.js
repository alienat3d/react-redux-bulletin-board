import {Link} from "react-router-dom";

// 3.7 Here we'll create a header to always be able to navigate between parts of our app.
// (Go to [src/components/Layout.js])
const Header = () => {
  return (
    <header className="header">
      <h1>Redux Blog</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="post">Post</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
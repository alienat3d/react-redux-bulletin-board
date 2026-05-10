// 0.0 In this lesson, we’ll work on optimizing the app. Right now, there are a few issues—for example, when we click on one of the emojis, all 100 posts are re-rendered every time, even though we’ve only changed the counter for one of them. We definitely need to fix this.
// 0.1.0 But we'll start with creating this new component users list.
import {useSelector} from "react-redux";
import {selectAllUsers} from "./usersSlice";
import {Link} from "react-router-dom";

const UsersList = () => {
  // 0.1.1 We'll get all users with selector "selectAllUser".
  const users = useSelector(selectAllUsers);

  // 0.1.2 Then we render the users as list items by using "map" method on them.
  const renderedUsers = users.map(user => (
    <li key={user.id}>
      {/* 0.1.3 Each user will get its own link which leads to the individual user page using user ID. */}
      {/* (Go to [src/features/users/usersSlice.js]) */}
      <Link to={`/user/${user.id}`}>{user.name}</Link>
    </li>
  ));

  return (
    <section>
      <h2>Users</h2>

      <ul>{renderedUsers}</ul>
    </section>
  );
};

export default UsersList;
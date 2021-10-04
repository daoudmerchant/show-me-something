import { Link } from "react-router-dom";
import { signInWithGoogle } from "../API/firebase/firebase";

import defaultProfilePic from "../images/profile-default.png";

const NavBar = ({ userState }) => {
  const { user, setUser } = userState;
  console.log(user);
  return (
    <nav>
      <Link to="/" id="home">
        ShowMeSomething
      </Link>
      <Link to="/about">About</Link>
      {!user ? (
        <p
          onClick={() => {
            signInWithGoogle();
          }}
        >
          Login
        </p>
      ) : (
        <Link to="/settings">
          <div id="userbar">
            <p>{user.displayName}</p>
            <img
              id="userpic"
              src={user.photoURL || defaultProfilePic}
              alt="user profile pic"
            />
          </div>
        </Link>
      )}
    </nav>
  );
};

export default NavBar;

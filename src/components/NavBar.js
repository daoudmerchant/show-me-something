import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { signInWithGoogle } from "../API/firebase/firebase";

import defaultProfilePic from "../images/profile-default.png";

const NavBar = ({ user }) => {
  const { pathname } = useLocation();
  user && console.log(user.photoURL);
  return (
    <nav>
      <Link to="/" id="home">
        ShowMeSomething
      </Link>
      <Link to="/about">About</Link>
      {!user ? (
        <p onClick={signInWithGoogle}>Login</p>
      ) : (
        <Link
          to={{
            pathname: "/settings",
            state: { from: pathname },
          }}
        >
          <div id="userbar">
            <p>{user.displayName}</p>
            <img id="userpic" src={user.photoURL} alt="user profile pic" />
          </div>
        </Link>
      )}
    </nav>
  );
};

export default memo(NavBar);

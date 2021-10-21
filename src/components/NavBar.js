import { useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { signInWithGoogle } from "../API/firebase/firebase";

const NavBar = ({ user }) => {
  const [canGetPic, setCanGetPic] = useState(true);
  const { pathname } = useLocation();
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
            <p>{user.displayName.join(" ")}</p>
            {user.photoURL && canGetPic ? (
              <img
                className="userpic"
                src={user.photoURL}
                alt="user profile pic"
                onError={() => setCanGetPic(false)}
              />
            ) : (
              <div className="userpic">
                <p>{user.displayName.map((name) => name.slice(0, 1))}</p>
              </div>
            )}
          </div>
        </Link>
      )}
    </nav>
  );
};

export default NavBar;

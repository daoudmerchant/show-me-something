import { useState } from "react";
import { useMediaQuery } from "react-responsive";

import { Link } from "react-router-dom";
import { signInWithGoogle } from "../API/firebase/firebase";

import "../styles/Navbar.css";

const NavBar = ({ user, confirmWelcomed }) => {
  // state
  const [canGetPic, setCanGetPic] = useState(true);

  // locataion

  // // media queries
  // const mediumScreen = useMediaQuery({ query: "(min-width: 430px)" });
  // const bigScreen = useMediaQuery({ query: "(min-width: 550px)" });
  // TODO: Add listen for window resize

  return (
    <nav>
      <Link to="/" id="home">
        ShowMeSomething
      </Link>
      <Link to="/about" onClick={confirmWelcomed}>
        About
      </Link>
      {!user ? (
        <div
          id="userbar"
          onClick={() => {
            signInWithGoogle();
            confirmWelcomed();
          }}
        >
          <div id="username">
            <p className="name1">Login</p>
          </div>
          <div className="userpic">
            <p>?</p>
          </div>
        </div>
      ) : (
        <Link to="/settings" onClick={confirmWelcomed}>
          <div id="userbar">
            <div id="username">
              {[
                user.displayName[0],
                user.displayName[user.displayName.length - 1],
              ].map((name, i) => {
                return <p className={`name${i + 1}`}>{name}</p>;
              })}
            </div>
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

import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <Link to="/" id="home">
        ShowMeSomething
      </Link>
      <Link to="/about">About</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
};

export default NavBar;

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// components
import Header from "./components/Header";
import App from "./App";
import Login from "./components/Login";

const Routes = () => {
  return (
    <>
      <Header />
      <Router>
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    </>
  );
};

export default Routes;

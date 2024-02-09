// https://dev.to/collins87mbathi/reactjs-protected-route-m3j
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const IsLoggedOut = ({ children }) => {
  const loggedIn = useSelector((state) => state.isLoggedIn.login);
  let location = useLocation();

  if (loggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

IsLoggedOut.propTypes = {
  children: PropTypes.any,
};

export default IsLoggedOut;

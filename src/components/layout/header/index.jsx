import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./header.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const Header = () => {
  const history = useHistory();

  const profi = () => {
    history.push("/profile");
  };
  const out = () => {
    if (window.confirm("Do You want to exit")) {
      localStorage.clear();
      history.push("/");
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-logo">
          <Link to="/dashboard">
            <img src="/images/logo.svg" alt="logo" />
          </Link>
        </div>
        <div className="navbarInnerdiv">
          <div className="Leave_button ">
            <Link to="/leave">
              <button type="button" className="btn btn-warning">
                Apply Leave
              </button>
            </Link>
          </div>
          <div className="logout_svg_image ">
            <div>
              <img  onClick={profi} className="navimg" src={localStorage.getItem("image")} alt="img"/>
              <i  onClick={out} className="fa fa-sign-out fa-2x" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

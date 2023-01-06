import React, { useEffect } from "react";
import "./sidebar.css";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  var Rights = JSON.parse(localStorage.getItem("rights"));



  return (
    <div className="sidebar">
      <Link to="/dashboard" className="active">
        <div className={location.pathname == "/dashboard" ? "list route_style active" : "list route_style"}>
          <div className="nav-link text-dark">
            <div className="sidebar_icon">
              <i className="fa fa-home fa-2x"><span>Dashboard</span></i>
            </div>
          </div>
        </div>
      </Link>
      {
        Rights ?
          Rights.map((right, ind) => {
            return (
              <div key={`side-bar${ind}`}>
                <Link to={right.SidebarID.route} >
                  <div className={location.pathname == right.SidebarID.route ? "active list route_style" : "list route_style"}>
                    <div className="nav-link text-dark">
                      <div className="sidebar_icon">
                        <i className={right.SidebarID.icon} aria-hidden="true"><span>{right.SidebarID.name.charAt(0).toUpperCase() + right.SidebarID.name.slice(1)}</span></i>

                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          }) : ""
      }
      <Link to="/profile" >
        <div className={location.pathname == "/profile" ? "active list route_style" : "list route_style"}  >
          <div className="nav-link text-dark">
            <div className="sidebar_icon">
              <i className="fa fa-id-badge fa-2x"><span>Profile</span></i>
            </div>

          </div>
        </div>
      </Link>
    </div>
  );
};


export default Sidebar;

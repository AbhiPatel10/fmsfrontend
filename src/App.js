import React, { useState } from "react";
import './app.css';
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import "./intercepter";
import Login from "./pages/login";
import Role from "./pages/role";
import Dashboard from "./pages/dashboard";
import Projects from "./pages/projects";
import Project from "./components/addproject";
import User from "./pages/user";
import AddRole from "./components/addrole";
import Adduser from "./components/adduser";
import Profile from "./pages/profile";
import Layout from "./components/layout/index";
import Task from "./pages/task";
import AddTask from "./components/addtask";
import Alert from "./components/alert/Alert";
import Leave from "./pages/Leave/index"
import { Toaster } from 'react-hot-toast';

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };
  function ProtectedRoute(body) {
    const { component: Component, ...props } = body;
    const rights = JSON.parse(localStorage.getItem("rights"));


    return (
      <Route

        render={(props) =>
          localStorage.getItem("token") !== null ||
            (rights &&
              rights
                .map((data) => data.SidebarID.route == body.path)
                .includes(true)) ? (
            <Component
              {...props}
              accessOption={
                rights.filter((data) => data.SidebarID.route == body.path)[0]
              }
              showAlert={showAlert}
            />
          ) : (
            <Redirect to="/" />
          )
        }
        {...props}
      />
    );
  }
  return (
    <>
      <Router>
        <Toaster />
        <Alert alert={alert} />
        <Switch>
          <Route path="/" exact>
            <Login showAlert={showAlert} />
          </Route>
          <Layout>
            <ProtectedRoute exact path="/dashboard" title="dashboard" component={Dashboard} />
            <ProtectedRoute exact path="/task" title="task" component={Task} />
            <ProtectedRoute exact path="/user" title="user" component={User} />
            <ProtectedRoute exact path="/project" title="project" component={Projects} />
            <ProtectedRoute exact path="/role" title="role" component={Role} />
            <ProtectedRoute exact path="/profile" title="profile" component={Profile} />
            <ProtectedRoute exact path="/user/add" title="user/add" component={Adduser} />
            <ProtectedRoute exact path="/user/:id/edit" title="user/:id/edit" component={Adduser} />
            <ProtectedRoute exact path="/project/add" title="project/add" component={Project} />
            <ProtectedRoute
              exact
              path="/project/:id/edit"
              component={Project}
              title="project/:id/edit"
            />
            <ProtectedRoute exact path="/task/add" title="task/add" component={AddTask} />
            <ProtectedRoute exact path="/task/:id/edit" title="task/:id/edit" component={AddTask} />
            <ProtectedRoute exact path="/role/add" title="role/add" component={AddRole} />
            <ProtectedRoute exact path="/role/:id/edit" title="role/:id/edit" component={AddRole} />
            <ProtectedRoute exact path="/leave" title="leave" component={Leave} />

          </Layout>
        </Switch>
      </Router>
    </>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import "./addrole.css";
import { Link, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./addrole.css";
import { AddRoleHandler, UpdateRoleHandler, GetRoleHandler } from "../../service/auth.service";
import { Name_REGEX } from "../../helper/validation";
import { successToast, errorToast } from "../../helper.js"
import { useHistory } from "react-router-dom";

const AddRole = () => {
  const { id } = useParams();
  document.title = id ? "UpdateRole | FMS" : "AddRole | FMS";
  const history = useHistory();
  const [name, setName] = useState("");
  const [errorname, setErrorName] = useState('');


  function rolevalidator() {
    let formIsValid = true;
    if (!Name_REGEX.test(name) === true) {
      formIsValid = false;
      setErrorName("Enter Valid Role");
    }
    return formIsValid;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (rolevalidator()) {
      if (!id) {
        const data = { name }
        const response = await AddRoleHandler(data);
        if (response.data.success) {
          successToast(response.data.message)
          setName("");
          history.push("/role");
        } else {
          errorToast(response.data.message)
        }
      } else {
        const body = {
          "name": name
        }
        const response = await UpdateRoleHandler(id, body);
        if (response.data.success === true) {
          successToast(response.data.message)
          history.push("/role");
        } else {
          errorToast(response.data.message)
        }
      }

    }

  };
  const getRoleData = async () => {

    if (id) {

      const response = await GetRoleHandler(id, "tokenPass");
      setName(response.data.data.name);
    }
  };
  useEffect(() => {
    getRoleData();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <form onSubmit={handleSubmit}>
      <div className="project_conrainer">
        <h3 style={{ color: "rgb(33 37 41)", marginLeft: "100px", marginBottom: "20px", fontSize: "35px", fontWeight: "bolder" }}> {id ? "Update-Role" : "Add-Role"}</h3>
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
            <b>Role Name :</b>
          </label>
          <div className="col-sm-10">
            <input
              name="name"
              className="form-control w-auto border border-dark"
              type="text"
              onChange={(e) => [setName(e.target.value), setErrorName('')]}
              onBlur={rolevalidator}
              placeholder="Enter Role"
              maxLength="15"
              value={name}
            />
            <p className="Errorstyle">{errorname}</p>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-success m-4"
        // onKeyPress={handleKeypress}
        >
          {id ? "Update" : "Create"}
        </button>
        <Link to="/role">
          <button type="button" className="btn btn-danger">
            Back
          </button>
        </Link>
      </div>
    </form>
  );
};
export default AddRole;

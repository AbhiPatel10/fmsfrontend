import React, { useEffect, useState } from "react";
import "./addproject.css";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import { AddProjectHandler, UpdateProjectHandler, UserHandler, GetProjectHandler } from "../../service/auth.service";
import { Name_REGEX } from "../../helper/validation";
import { successToast, errorToast } from "../../helper.js"
import { useHistory } from "react-router-dom";

const Project = (props) => {
  const { id } = useParams();
  document.title = id ? "UpdateProject | FMS" : "AddProject | FMS"
  const history = useHistory();
  const [userdata, SetUserdata] = useState([]);
  const [projectname, SetProjectname] = useState("");
  const [manager, setManager] = useState("");
  const [teamname, setTeamname] = useState([]);
  const [description, setDescription] = useState("");
  const [startdate, setStartdate] = useState("");

  const [errorteamname, setErrorTeamname] = useState([]);
  const [errorprojectname, SeterrorProjectname] = useState("");
  const [errordescription, setErrorDescription] = useState("");
  const [errormanager, seterrorManager] = useState("");
  const [errorstartdate, seterrorStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [errorenddate, seterrorEnddate] = useState("");

  function Projectvalidator() {
    let formIsValid = true;
    if (!Name_REGEX.test(projectname) === true) {
      formIsValid = false;
      SeterrorProjectname("Enter Valid Project Name");
    } if (manager.length === 0) {
      formIsValid = false;
      seterrorManager("Please Select One Manager For Project");
    } if (description.length > 500) {
      formIsValid = false;
      setErrorDescription("Please Enter Below 500 Charaters");
    } if (startdate.length === 0) {
      formIsValid = false;
      seterrorStartdate("Please Select Start Date");
    } if (teamname.length === 0) {
      formIsValid = false;
      setErrorTeamname("Please Select One Team Member");
    }
    if (enddate.length === 0) {
      formIsValid = false;
      seterrorEnddate("Please Select End Date");
    }
    return formIsValid;
  }

  const getalldata = async () => {
    const body = JSON.stringify({
      where: {
        isActive: "true",
      },
      pagination: {
        sortBy: "createdAt",
        descending: true,
        rowsPerPage: 44,
        page: 1,
      },
    });
    if (id) {
      const response = await GetProjectHandler(id, "tokenPass");
      SetProjectname(response.data.data.name);
      setDescription(response.data.data.description);
      setStartdate(response.data.data.start_date);
      setEnddate(response.data.data.end_date);
      setManager(response.data.data.manager._id);

      const dateData = () =>
        response.data.data.team.forEach((data) => {
          let temp = teamname;
          temp.push(data._id);
          setTeamname(temp);
        });
      dateData();

    }
    const response = await UserHandler(body);
    SetUserdata(response.data.data.list);

  };
  useEffect(() => {
    getalldata();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    if (Projectvalidator()) {

      e.preventDefault();
      const body = JSON.stringify({
        name: projectname,
        manager: manager,
        team: teamname,
        description: description,
        start_date: startdate,
        end_date: enddate,
      });
      if (id) {
        const response = await UpdateProjectHandler(id, body);
        if (response.data.success) {
          successToast(response.data.message);
          history.push("/project");
        } else {
          errorToast(response.data.message)
        }

      } else {
        const response = await AddProjectHandler(body);
        if (response.data.success) {
          successToast(response.data.message);
          setEnddate("");
          setStartdate("");
          setDescription("");
          setTeamname([]);
          SetProjectname("");
          setManager("");
          history.push("/project");
        } else {
          errorToast(response.data.message)
        }
      }



    }
  };



  return (
    <>
      <div className="project_container">
        <h3 style={{ color: "rgb(33 37 41)", marginLeft: "100px", marginBottom: "20px", fontSize: "35px", fontWeight: "bolder" }}> {id ? "Update-Project" : "Add-Project"}</h3>

        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
            <b>Project Name</b>
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control w-auto border-dark"
              id="staticEmail"
              onChange={(e) => [SetProjectname(e.target.value), SeterrorProjectname('')]}
              value={projectname}
              placeholder="Enter project name"
            />
            <p className="Errorstyle">{errorprojectname}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            <b>Manager</b>
          </label>
          <div className="col-sm-10">
            <select
              className="form-select w-auto border border-dark"
              aria-label="Default select example"
              value={manager}
              onChange={(e) => [setManager(e.target.value), seterrorManager('')]}
            >
              <option> Select Manager </option>
              {userdata &&
                userdata.map((data, index) => {
                  return (
                    data.role.name === "manager" && (
                      <option value={data._id} key={index}>
                        {data.first_name}
                      </option>
                    )
                  );
                })}
            </select>
            <p className="Errorstyle">{errormanager}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            <b>Team</b>
          </label>
          <div className="col-sm-10">
            <select
              className="form-select w-auto border border-dark"
              aria-label=".form-select-sm example"
              multiple
              onChange={(e) => [
                setTeamname([...e.target.selectedOptions].map((o) => o.value)), setErrorTeamname('')]
              }
              value={teamname}
            >
              {userdata &&
                userdata.length > 0 &&
                userdata.map((user, index) => {
                  return (
                    <option key={index} value={user._id}>
                      {user.first_name}
                    </option>
                  );
                })}
            </select>
            <p className="Errorstyle">{errorteamname}</p>

          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
            <b>Description</b>
          </label>
          <div className="col-sm-10">
            <textarea
              id="exampleFormControlTextarea1"
              rows="3"
              className="border border-dark"
              onChange={(e) => [setDescription(e.target.value), setErrorDescription('')]}
              value={description}
            ></textarea>
            <p className="Errorstyle">{errordescription}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
            <b> Start Date</b>
          </label>
          <div className="col-sm-10">
            <input
              className="w-auto border border-dark"
              type="date"

              id="startdate"
              name="startdate"

              onChange={(e) => [setStartdate(e.target.value), seterrorStartdate('')]}
              value={moment(startdate).format("YYYY-MM-DD")}
            />
            <p className="Errorstyle">{errorstartdate}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
            <b>End Date</b>
          </label>
          <div className="col-sm-10">
            <input
              type="date"
              id="enddate"
              name="enddate"
              className="border border-dark"
              onChange={(e) => [setEnddate(e.target.value), seterrorEnddate('')]}
              value={moment(enddate).format("YYYY-MM-DD")}
            />
            <p className="Errorstyle">{errorenddate}</p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-success m-4"
          onClick={handleSubmit}
        >
          {id ? "Update" : "Create"}
        </button>
        <Link to="/project">
          <button type="button" className="btn btn-danger">
            Back
          </button>
        </Link>
      </div>
    </>
  );
};

export default Project;

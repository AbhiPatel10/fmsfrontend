import React, { useEffect, useState } from "react";
import TagsInput from "../tag";
import "./addtask.css";
import { useParams, Link } from "react-router-dom";
import {
  AddTaskHandler,
  UpdateTaskHandler,
  GetTaskHandler,
  UserHandler,
  ProjectHandler,
} from "../../service/auth.service";
import { Name_REGEX } from "../../helper/validation";
import { successToast, errorToast } from "../../helper.js";
import { useHistory } from "react-router-dom";

const AddTask = (props) => {
  const { id } = useParams();
  document.title = id ? "UpdateTask | FMS" : "AddTask | FMS";
  const history = useHistory();
  const [taskName, SetTaskname] = useState("");
  const [project, setProject] = useState([]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(!id ? "ASSIGN" : "");
  // const [comments, setComments] = useState([]);
  const [assignTo, setAssignTo] = useState("");
  const [ExpectedTime, setExpectedTime] = useState("");
  const [RealTime, setRealTime] = useState("");
  const [tag, setTag] = useState("");
  const [projectData, setProjectData] = useState("");
  const [userdata, setUserdata] = useState("");

  const [ErrorRealTime, setErrorRealTime] = useState("");
  const [ErrorExpectedTime, setErrorExpectedTime] = useState("");
  const [errortaskName, SetErrorTaskname] = useState("");
  const [errordescription, setErrorDescription] = useState("");
  const [errorstatus, setErrorStatus] = useState("");
  const [errorcomments, setErrorComments] = useState([]);
  const [errorassignTo, setErrorAssignTo] = useState("");
  const [errorprojectData, setErrorProjectData] = useState("");

  const hours = [
    "Select time",
    "0.30",
    "1.00",
    "1.30",
    "2.00",
    "2.30",
    "3.00",
    "3.30",
    "4.00",
    "4.30",
    "5.00",
    "5.30",
    "6.00",
    "6.30",
    "7.00",
    "7.30",
    "8.00",
    "8.30",
    "9.00",
    "9.30",
    "10.00",
    "10.30",
    "11.00",
    "11.30",
    "12.00",
  ];
  const stage = ["ASSIGN", "INPROGRESS", "TEST", "DONE"];

  function taskvalidator() {
    let formIsValid = true;
    if (!Name_REGEX.test(taskName) === true) {
      formIsValid = false;
      SetErrorTaskname("Enter Valid Task Name");
    }
    if (projectData === "") {
      formIsValid = false;
      setErrorProjectData("Please Select One Project");
    }
    if (description.length > 500) {
      formIsValid = false;
      setErrorDescription("Please Enter Below 500 Charaters");
    }
    if (status === "") {
      formIsValid = false;
      setErrorStatus("Please Select One Status");
    }
    if (tag.length === 0) {
      formIsValid = false;
      setErrorComments("Please Add Atleast One Comment");
    }
    if (ExpectedTime.length === 0 && !id) {
      formIsValid = false;
      setErrorExpectedTime("Please Select One Expected Time");
    }
    if (RealTime.length === 0 && id) {
      formIsValid = false;
      setErrorRealTime("Please Select One Real Time");
    }
    if (userdata.length === 0) {
      formIsValid = false;
      setErrorAssignTo("Please Select One User For Assign Task");
    }
    return formIsValid;
  }

  const selectedTags = (tags) => {
    setTag(tags);
    setErrorComments('')
  };

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
    const response = await ProjectHandler(body);
    setProject(response.data.data.list);
  };
  useEffect(() => {
    getalldata();
  }, []);
  const projectHandler = (projectid) => {
    setProjectData(projectid);
  };

  const getassdata = async () => {
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
    const response = await UserHandler(body);
    setAssignTo(response.data.data.list);
  };
  useEffect(() => {
    getassdata();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const userHandling = (userid) => {
    setUserdata(userid);
  };
  const assignById = localStorage.getItem("id");

  const handleSubmit = async (e) => {
    if (taskvalidator()) {
      e.preventDefault();
      const body = JSON.stringify({
        name: taskName,
        project_id: id ? projectData._id : projectData,
        description: description,
        status: status,
        comments: tag,
        AssignTo: userdata,
        AssignBy: assignById,
        Duration: {
          Exception: ExpectedTime,
          Realtime: RealTime,
        },
      });
      if (id) {
        const response = await UpdateTaskHandler(id, body);
        if (response.data.success) {
          successToast(response.data.message);
          history.push("/task");
        } else {
          errorToast(response.data.message)
        }
      } else {
        const response = await AddTaskHandler(body);
        if (response.data.success) {
          successToast(response.data.message);
          SetTaskname("");
          setProject("");
          setDescription("");
          setStatus("");
          setTag([]);
          setAssignTo("");
          setExpectedTime("");
          setRealTime("");
          history.push("/task");
        } else {
          errorToast(response.data.message)
        }
      }
    }
  };

  const getUserData = async () => {
    if (id) {
      const response = await GetTaskHandler(id, "tokenPass");
      SetTaskname(response.data.data.name);
      setProjectData(response.data.data.project_id);
      setDescription(response.data.data.description);
      setStatus(response.data.data.status);
      setTag(response.data.data.comments);
      setUserdata(response.data.data.AssignTo._id);
      setExpectedTime(response.data.data.Duration.Exception);
      setRealTime(response.data.data.Duration.Realtime);
    }
  };
  useEffect(() => {
    getUserData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="task_container">
        <h3 style={{ color: "rgb(33 37 41)", marginLeft: "100px", marginBottom: "20px", fontSize: "35px", fontWeight: "bolder" }}> {id ? "Update-Task" : "Add-Task"}</h3>
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
            <b>Task Name</b>
          </label>
          <div className="col-sm-10">
            <input
              placeholder="Describe Task"
              type="text"
              id="staticEmail"
              className="form-control w-auto border border-dark"
              onChange={(e) => [SetTaskname(e.target.value), SetErrorTaskname('')]}
              disabled={id ? true : false}
              value={taskName}
            />
            <p className="Errorstyle">{errortaskName}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            <b>Project</b>
          </label>
          <div className="col-sm-10">
            <select
              value={id ? projectData?._id : project.name}
              onChange={(e) => [projectHandler(e.target.value), setErrorProjectData("")]}
              disabled={id ? true : false}
              className="form-select w-auto border border-dark"
              aria-label="Default select example"
            >
              <option> Select Project </option>
              {project.length > 0 &&
                project.map((projects, index) => {
                  return (
                    <option key={index} value={projects._id}>
                      {" "}
                      {projects.name}
                    </option>
                  );
                })}
            </select>
            <p className="Errorstyle">{errorprojectData}</p>
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
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            <b>Status</b>
          </label>
          <div className="col-sm-10">
            <select
              placeholder="Select Project Status"
              className="form-select w-auto border border-dark"
              aria-label="Default select example"
              value={status}
              disabled={!id ? true : false}
              onChange={(e) => [setStatus(e.target.value), setErrorStatus('')]}
            >
              {!id ? (
                <option defaultValue disabled value="ASSIGN">
                  {" "}
                  ASSIGN{" "}
                </option>
              ) : (
                ""
              )}
              {stage &&
                stage.length > 0 &&
                id &&
                stage.map((situation, index) => (
                  <option key={index}>{situation}</option>
                ))}
            </select>
            <p className="Errorstyle">{errorstatus}</p>
          </div>
        </div>
        <div className="mb-3 row ">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label  ">
            <b>Comments</b>
          </label>
          <div className="col-sm-10">
            <TagsInput
              className="form-control w-auto border border-dark"
              selectedTags={selectedTags}
              tags={tag}
              value={tag}

            />
            <p className="Errorstyle">{errorcomments}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            <b>AssignTo</b>
          </label>
          <div className="col-sm-10">
            <select
              className="form-select w-auto border border-dark"
              aria-label="Default select example"
              value={id ? userdata : assignTo.name}
              onChange={(e) => [userHandling(e.target.value), setErrorAssignTo('')]}
            >
              <option> Select User to Assign Project </option>
              {assignTo.length > 0 &&
                assignTo.map((users, index) => {
                  return (
                    <option key={`form-select ${index}`} value={users._id}>
                      {" "}
                      {users.first_name}
                    </option>
                  );
                })}
            </select>
            <p className="Errorstyle">{errorassignTo}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            <b>ExpectedTime</b>
          </label>
          <div className="col-sm-10">
            <select
              value={ExpectedTime}
              onChange={(e) => [setExpectedTime(e.target.value), setErrorExpectedTime('')]}
              className="border border-dark"
              disabled={id ? true : false}
            >
              {hours.map((name, index) => (
                <option key={index}>{name}</option>
              ))}
            </select>
            <p className="Errorstyle">{ErrorExpectedTime}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            <b>RealTime</b>
          </label>
          <div className="col-sm-10">
            <select
              value={RealTime}
              disabled={!id ? true : false}
              onChange={(e) => [setRealTime(e.target.value), setErrorRealTime('')]}
              className="border border-dark"
            >
              {hours &&
                hours.length > 0 &&
                hours.map((name, index) => <option key={index}>{name}</option>)}
            </select>
            <p className="Errorstyle">{ErrorRealTime}</p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-success m-4 "
          onClick={handleSubmit}
        >
          {id ? "Update" : "Create"}
        </button>
        <Link to="/task">
          <button type="button" className="btn btn-danger">
            Back
          </button>
        </Link>
      </div>
    </>
  );
};

export default AddTask;

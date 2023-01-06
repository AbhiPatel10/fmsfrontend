import React, { useEffect, useState } from "react";
import "./project.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { successToast } from "../../helper.js"
import { Pagination } from "@material-ui/lab";
import { SkeletonProject } from '../../components/skeleton/index';
import { ProjectHandler, ProjectDeleteHandler, ProjectDeleteAllHandler } from "../../service/auth.service";

const Projects = (props) => {
  document.title = "Project | FMS";
  const history = useHistory();
  const [ApiData, setApiData] = useState("");
  const [selectid, setSelectid] = useState([]);
  const [counting, setcounting] = useState(null);
  const [page, setPage] = useState(1);
  const [projectid, setProjectId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataNotFound, setDataNotFound] = useState(false);

  const handleselectall = (e) => {
    if (e.target.checked) {
      let temp = [];
      let tempData = ApiData.map((data) => {
        temp.push(data._id);
        return { ...data, checked: true }
      });
      setSelectid(temp)
      setApiData(tempData);
    } else {
      let tempData = ApiData.map((data) => {
        return { ...data, checked: false };
      });
      setSelectid([])
      setApiData(tempData);
    }
  };

  const handleCheck = (event, projectId) => {
    if (event.target.checked) {
      let tempData = ApiData.map((data) => {
        if (data._id === projectId) {
          return { ...data, checked: true };
        } else {
          return data;
        }
      });
      setApiData(tempData);
      let temp = projectid;
      temp.push(projectId);
      setProjectId(temp);
    } else {
      let tempData = ApiData.map((data) => {
        if (data._id === projectId) {
          return { ...data, checked: false };
        } else {
          return data;
        }
      });
      setApiData(tempData);
      let temp = projectid;
      const index = temp.indexOf(projectId);
      temp.splice(index, 1);
      setProjectId(temp);
    }
  };
  const getalldata = async () => {
    setLoading(true);
    const body = JSON.stringify({
      where: {
        isActive: "true",
      },
      pagination: {
        sortBy: "createdAt",
        descending: true,
        rowsPerPage: 5,
        page: page,
      },
    });
    const response = await ProjectHandler(body);
    const total = response.data.data.count;

    setcounting(Math.ceil(total / 5));

    let tempData = response.data.data.list;
    if (tempData.length > 0) {
      tempData = tempData.map((data) => ({ ...data, checked: false }));
      setLoading(false);
      setApiData(tempData);
    } else {
      setLoading(false);
      setDataNotFound(true);
    }
  }
  useEffect(() => {
    getalldata();
    setDataNotFound(false);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handledit = async () => {
    if (projectid.length === 1) {
      history.push(`/project/${projectid}/edit`);
    } else if (selectid.length > 1) {
      alert("Please Select Only One Project For Edit");
    } else if (selectid.length === 0) {
      alert("Please Select One Project For Edit");
    }
  };

  const deletehandle = async () => {
    if (projectid.length > 0) {
      if (window.confirm("Do You Want to delete ?")) {
        const ids = selectid.length > 0 ? selectid.join(',') : projectid.join(',');
        const data = { isActive: "false" }
        const response = await ProjectDeleteHandler(ids, data);
        successToast(response.data.message);
        getalldata();
        setProjectId([]);
        setSelectid([]);
      }
    }
    else if (selectid.length > 0) {
      if (window.confirm("Do You Want to delete all projects?")) {
        const ids = selectid.length > 0 ? selectid.join(',') : projectid.join(',');
        const data = { isActive: "false" }
        const response = await ProjectDeleteAllHandler(ids, data);
        successToast(response.data.message);
        getalldata();
        setProjectId([]);
        setSelectid([]);
      }
    } else if (projectid.length === 0) {
      alert("Please Select One Project For delete");
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
    setSelectid([]);
  };



  return (
    <>
      <div className="dash pt-5">
        {props.accessOption.Operations.includes('C') ? <div className="dashch">
          <div className="child" href="#">
            <Link to="/project/add">
              <Button size="sm">
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New
                Project
              </Button>
            </Link>
          </div>
        </div> : ""}
        {props.accessOption.Operations.includes('U') ? <div className="dashch">
          <div className="child" href="#">
            <Button size="sm" onClick={handledit}>
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit Project
            </Button>
          </div>
        </div> : ""}
        {props.accessOption.Operations.includes('D') ? <div className="dashch">
          <div className="child" href="#">
            <Button size="sm" onClick={deletehandle}>
              <FontAwesomeIcon icon={faTrash} className="me-2" />
              Delete Project
            </Button>
          </div>
        </div> : ""}

        <table className="table m-5 table-bordered w-75">
          <thead className="table-project">
            <tr>
              <th>
                <input className="checkbox_project" checked={selectid.length > 0 ? true : false} onChange={(e) => handleselectall(e)} type="checkbox" />
              </th>
              <th scope="col">Project Name</th>
              <th scope="col">Manager</th>
              <th scope="col">Team</th>
              <th scope="col">Description</th>
              <th scope="col">Start-date</th>
              <th scope="col">End-date</th>
            </tr>

          </thead>

          {ApiData.length > 0 && !loading &&
            ApiData.map((project, index) => {
              return (
                <tbody key={`checkbox1_project ${index}`} className="table-project-body">
                  <tr >
                    <th>
                      <input
                        className="checkbox1_project"
                        type="checkbox"
                        checked={project.checked}
                        onChange={(e) => handleCheck(e, project._id)}
                      />
                    </th>
                    <td> {project.name}</td>
                    <td>
                      {" "}
                      {project.manager != null
                        ? project.manager.first_name
                        : "N/A"}
                    </td>
                    <td>
                      {project.team.length > 0 &&
                        project.team.map((team, index) => {
                          return (
                            <div key={index}>
                              {" "}
                              {team.first_name != null ? team.first_name : "N/A"}
                            </div>
                          );
                        })}
                    </td>
                    <td>{project.description}</td>
                    <td>{moment(project.start_date).format("DD-MM-YYYY")}</td>
                    <td>{moment(project.end_date).format("DD-MM-YYYY")}</td>
                  </tr>
                </tbody>
              );
            })}
          {
            dataNotFound &&
            <tbody className="table-role-body rounded-3">
              <tr>
                <td colSpan="7">
                  Data not Founnd
                </td>
              </tr>
            </tbody>
          }
          {loading &&
            [1, 2, 3, 4, 5].map((project, index) => {
              return (
                <tbody key={`checkbox ${index}`} className="table-project-body">
                  <tr key={index}>
                    <td>
                      <input
                        className="checkbox1_project"
                        type="checkbox"
                        checked={project.checked}
                        onChange={(e) => handleCheck(e, project._id)}
                      />
                    </td>
                    <td>{SkeletonProject(120, 40)}</td>
                    <td>{SkeletonProject(120, 40)}</td>
                    <td>{SkeletonProject(120, 40)}</td>
                    <td>{SkeletonProject(120, 40)}</td>
                    <td>{SkeletonProject(120, 40)}</td>
                    <td>{SkeletonProject(120, 40)}</td>
                  </tr>
                </tbody>
              );
            })}

        </table>
        <Pagination count={counting} onChange={handleChange} color="primary" />
      </div>
    </>
  );
};

export default Projects;
